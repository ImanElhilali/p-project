import React, { useState } from 'react'
import {
  Table,
  Button,
  Row,
  Col,
  Container,
  Modal,
  Form,
} from 'react-bootstrap'
import Loader from '../../components/Loader'
import Message from '../../components/Message'
import { FaEdit, FaPlus, FaTrash, FaCheck, FaTimes } from 'react-icons/fa'
import { useGetUsersQuery } from '../../slices/userApiSlice'
import { LinkContainer } from 'react-router-bootstrap'
import {
  useDeleteUserMutation,
  useRegisterMutation,
} from '../../slices/userApiSlice'
import { toast } from 'react-toastify'

const UserListScreen = () => {
  const [show, setShow] = useState(false)
  const handleShow = () => setShow(true)
  const handleClose = () => setShow(false)

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const { data: users, refetch, isLoading, error } = useGetUsersQuery()
  const [registerUser, { isLoading: loadingAdd, error: errorAdd }] =
    useRegisterMutation()

  const [deleteUser] = useDeleteUserMutation()

  const deleteHandler = async (id) => {
    if (window.confirm('Are you sure !')) {
      try {
        await deleteUser(id)
        refetch()
      } catch (error) {
        toast.error(error?.data?.message || error.error)
      }
    }
  }

  const submitHandler = async (e) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      toast.error('Passwords do not match')
    } else {
      try {
        await registerUser({ name, email, password })
        refetch()
        handleClose()
        setName('')
        setEmail('')
        setPassword('')
        setConfirmPassword('')
      } catch (error) {
        toast.error(error?.data?.message || error.error)
      }
    }
  }
  return (
    <Container>
      <Row className='justify-content-center'>
        <h1> المستخدمين</h1>
        <Col md={7}>
          <Button
            variant='outline-success'
            onClick={handleShow}
            style={{ marginBottom: '30px' }}
          >
            <FaPlus /> اضافة مستخدم
          </Button>
          <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title> اضافة مستخدم</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form onSubmit={submitHandler}>
                <Row className='my-2'>
                  <Col md={6}>
                    <Form.Group className='my-2' controlId='name'>
                      <Form.Control
                        type='text'
                        placeholder='ادخل اسم المستخدم'
                        autoComplete='off'
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      ></Form.Control>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className='my-2' controlId='email'>
                      <Form.Control
                        type='email'
                        placeholder='ادخل البريد الالكتروني'
                        autoComplete='off'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      ></Form.Control>
                    </Form.Group>
                  </Col>
                </Row>
                <Row className='my-2'>
                  <Col md={6}>
                    <Form.Group className='my-2' controlId='password'>
                      <Form.Control
                        type='password'
                        placeholder='ادخل كلمة المرور'
                        autoComplete='off'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      ></Form.Control>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className='my-2' controlId='confirmPassword'>
                      <Form.Control
                        type='password'
                        placeholder='ادخل كلمة المرور مرة اخرى'
                        autoComplete='off'
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      ></Form.Control>
                    </Form.Group>
                  </Col>
                </Row>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant='outline-success' onClick={handleClose}>
                اغلاق
              </Button>
              <Button variant='success' onClick={submitHandler}>
                حفظ
              </Button>
            </Modal.Footer>
          </Modal>
          {loadingAdd && <Loader />}
          {errorAdd && (
            <Message variant='danger'>
              {errorAdd?.data?.message || errorAdd.error}
            </Message>
          )}
          {isLoading ? (
            <Loader />
          ) : error ? (
            <Message variant='danger'>
              {error?.data?.message || error.error}
            </Message>
          ) : (
            <Table className='table-sm' striped bordered hover responsive>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Is Admin</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id}>
                    <td>{user._id}</td>
                    <td>{user.name}</td>
                    <td>
                      <a href={`mailto:${user.email}`}>{user.email}</a>
                    </td>
                    <td>
                      {user.isAdmin ? (
                        <FaCheck style={{ color: 'green' }} />
                      ) : (
                        <FaTimes style={{ color: 'red' }} />
                      )}
                    </td>
                    <td className='text-center'>
                      {!user.isAdmin && (
                        <>
                          <LinkContainer
                            to={`/admin/userlist/${user._id}/edit`}
                            style={{ marginLeft: '10px' }}
                          >
                            <Button className='btn-sm' variant='light'>
                              <FaEdit />
                            </Button>
                          </LinkContainer>
                          <Button
                            className='btn-sm'
                            variant='danger'
                            onClick={() => deleteHandler(user._id)}
                          >
                            <FaTrash style={{ color: 'white' }} />
                          </Button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Col>
      </Row>
    </Container>
  )
}

export default UserListScreen
