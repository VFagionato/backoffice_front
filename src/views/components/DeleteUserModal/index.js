import { Button, Modal } from "react-bootstrap"
import { api } from "../../../services/api"

const DeleteUserModal = ({ id, onHide, show = false, funcToClose }) => {
  const deleteUser = async (id) => {
    const response = await api.delete(`/user/${id}`, {
      headers: {
        authorization: `Bearer ${localStorage.getItem('access_token')}`
      }
    }).catch(error => false)

    if (!response) return

    funcToClose(false)
  }

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>deleting user: {id}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          Are you sure you would like to delete this user?
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={() => deleteUser(id)}>Delete</Button>
      </Modal.Footer>
    </Modal>
  )
}

export default DeleteUserModal