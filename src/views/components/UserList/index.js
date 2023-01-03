import { useEffect, useState } from "react"
import { Badge, Card, Dropdown } from "react-bootstrap"
import { useDispatch, useSelector } from "react-redux"
import { fetchUsers } from "../../../redux/slices/user.slices"
import DataTable from 'react-data-table-component';
import UpdateUserModal from "../UpdateUserModal";
import DeleteUserModal from "../DeleteUserModal";

const UserList = () => {
  const [updateModal, setUpdateModal] = useState(false)
  const [toUpdateId, setToUpdateId] = useState('')
  const [deleteModal, setDeletModal] = useState(false)
  const [toDeleteId, setToDeleteId] = useState('')
  const users = useSelector(state => state.userData.users)
  const dispatch = useDispatch()
  const columns = [
    {
      name: 'Name',
      selector: row => row.props.name,
    },
    {
      name: 'Email',
      selector: row => row.props.email,
    },
    {
      name: 'Permission',
      selector: row => row.props.permission,
      format: row => {
        if (row.props.permission === 1) {
          return <Badge bg='info'>Admin</Badge>
        }
        return <Badge bg='primary'>User</Badge>
      }
    },
    {
      name: 'Phone',
      selector: row => row.props.phone,
      format: row => {
        const { phone } = row.props
        return '(' + phone[0] + phone[1] + ')' + ' ' + phone.slice(2, 7) + '-' + phone.slice(7)
      }
    },
    {
      name: 'registered in',
      selector: row => row.props.createdAt,
      format: row => {
        const date = new Date(row.props.createdAt)
        return date.toLocaleString(navigator.language)
      }
    },
    {
      name: 'last update',
      selector: row => row.props.updatedAt,
      format: row => {
        if (!row.props.updatedAt) {
          return 'never'
        }
        const date = new Date(row.props.updatedAt)
        return date.toLocaleString(navigator.language)
      }
    },
    {
      name: 'deleted at',
      selector: row => row.props.deletedAt,
      format: row => {
        if (!row.props.deletedAt) {
          return 'none'
        }
        const date = new Date(row.props.deletedAt)
        return date.toLocaleString(navigator.language)
      }
    },
    {
      name: 'actions',
      cell: row => {
        return (
          <Dropdown id='users-actions'>
            <Dropdown.Toggle></Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item onClick={() => {
                setUpdateModal(true)
                setToUpdateId(row._id)
              }}>Update</Dropdown.Item>
              <Dropdown.Item onClick={() => {
                setDeletModal(true)
                setToDeleteId(row._id)
              }}>Delete</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        )
      }
    }
  ]

  useEffect(() => {
    dispatch(fetchUsers())
  }, [])

  return (<>
    <Card>
      <Card.Body>
        <DataTable highlightOnHover columns={columns} data={users} />
      </Card.Body>
    </Card>
    <UpdateUserModal
      show={updateModal}
      onHide={() => setUpdateModal(false)}
      id={toUpdateId}
      funcToClose={setUpdateModal}
    />
    <DeleteUserModal
      show={deleteModal}
      onHide={() => setDeletModal(false)}
      id={toDeleteId}
      funcToClose={setDeletModal}
    />
  </>)
}

export default UserList