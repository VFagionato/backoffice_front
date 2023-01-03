import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from "react-redux"
import { Button, Card, Form, Spinner } from 'react-bootstrap'
import { fetchUserById } from '../../../redux/slices/user.slices'
import { useForm } from 'react-hook-form'
import { api } from '../../../services/api'

const EditUser = () => {
  const [errorMessage, setErrorMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { user } = useSelector(state => state.userData)
  const { register, handleSubmit, reset } = useForm()
  const dispatch = useDispatch()

  const submit = async (data) => {
    for (const [key, value] of Object.entries(data)) {
      if (!value.length) {
        delete data[key]
      }
    }

    setIsLoading(true)
    const response = await api.patch(`/user/${user.id}`, { ...data }, {
      headers: {
        authorization: `Bearer ${localStorage.getItem('access_token')}`
      }
    }).catch(error => {
      const { response } = error
      setErrorMessage(response.message)
      setIsLoading(false)
      setTimeout(() => {
        setErrorMessage('')
      }, 3000)
      return false
    })

    if (!response) return
    setIsLoading(false)
    dispatch(fetchUserById())
    reset()
  }

  const createFilds = () => {
    return Object.entries(user).filter(element => {
      const [name, value] = element
      if ((name === 'permission' && value === 0) || name === 'id' || name === 'createdAt') return false
      return true
    })
  }

  const defineType = (keyName) => {
    const types = {
      email: 'email',
      password: 'password'
    }

    if (types[keyName]) {
      return types[keyName]
    }

    return
  }

  useEffect(() => {
    dispatch(fetchUserById())
  }, [])


  return (
    <>
      <Card className='p-3 mb-3'>
        <Card.Header>
          <Card.Title >
            Profile
          </Card.Title>
        </Card.Header>
        <Card.Body>
          <Form onSubmit={(handleSubmit(submit))}>
            {createFilds(user).map((item, index) => {
              const [name, value] = item
              return (
                <Form.Group className='mb-2' key={index}>
                  <Form.Label>{name[0].toUpperCase() + name.slice(1)}</Form.Label>
                  <Form.Control
                    type={defineType(name)}
                    placeholder={name === 'password' ? 'new password' : value}
                    {...register(name)}
                  />
                </Form.Group>
              )
            })}
            {!!errorMessage.length && <Card.Text>{errorMessage}</Card.Text>}
            <Button variant="primary" type='submite'>
              {isLoading ? <Spinner animation='border' /> : 'Submit'}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </>
  )
}

export default EditUser