import { Button, Col, Container, Row } from "react-bootstrap"
import { useNavigate } from "react-router-dom"
import { useEffect, useState } from 'react'
import EditUser from "../components/EditUser"
import { useSelector } from "react-redux"
import UserList from "../components/UserList"
import { api } from "../../services/api"
import CreateUserModal from "../components/CreateUserModal"

export const Dashboard = () => {
  const user = useSelector(state => state.userData.user)
  const [createModal, setCreateModal] = useState(false)
  const navegate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('access_token')
    api.get('/user', { headers: { authorization: `Bearer ${token}` } }).then(result => {
      return
    }).catch(error => {
      navegate('/login')
    })
  }, [])

  return (
    <Container fluid className="p-3">
      <Row>
        <Col xs={3}>
          <EditUser />
        </Col>
        <Col>
          {user.permission === 1 && <>
            <Button onClick={() => setCreateModal(true)}>Create new user</Button>
            <CreateUserModal show={createModal} onHide={() => setCreateModal(false)} funcToClose={setCreateModal} />
          </>}
        </Col>
        <Col>
          <Button>Logout</Button>
        </Col>
      </Row>
      <Row>
        <Col>
          {user.permission === 1 && <UserList />}
        </Col>
      </Row>
    </Container>
  )
}