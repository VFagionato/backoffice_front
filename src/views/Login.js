import { useState } from "react"
import { Alert, Button, Container, Row, Card, Form } from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { fetchUserById } from "../redux/slices/user.slices"
import { api } from "../services/api"

function Login() {
  const [message, setMessage] = useState(null)
  const { register, handleSubmit, formState: { errors } } = useForm()
  const dispatch = useDispatch()
  const navegate = useNavigate()

  const handleMessage = (message) => {
    setMessage(message)
    setTimeout(() => setMessage(null), 3000)
  }


  const onSubmit = async (data) => {
    const response = await api.post('/auth/login', data)
      .catch(error => {
        const { response } = error
        handleMessage({
          text: response.data.message,
          variant: 'danger'
        })
      })

    if (!response) return

    const { access_token } = response.data

    localStorage.setItem('access_token', access_token)

    handleMessage({ text: 'successful login', variant: 'success' })

    dispatch(fetchUserById())

    navegate('/')
  }

  return (
    <Container fluid style={{ height: '100vh' }} className='d-flex align-items-center justify-content-md-center'>
      <Row className='justify-content-md-center'>
        <Card>
          <Card.Body>
            <Card.Title className='mb-4'>Login Form</Card.Title>
            <Form onSubmit={handleSubmit(onSubmit)}>
              {message && <Alert variant={message.variant}>{message.text}</Alert>}
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter email"
                  {...register('email', { required: true })}
                />
                {errors.email && <Form.Text muted>Email is required</Form.Text>}
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Password"
                  {...register('password', { required: true })}
                />
                {errors.password && <Form.Text muted>password is required</Form.Text>}

              </Form.Group>
              <Button variant="primary" type='submite'>
                Submit
              </Button>
            </Form >
          </Card.Body>
        </Card>
      </Row>
    </Container>
  )
}

export default Login;
