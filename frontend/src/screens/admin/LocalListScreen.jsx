import { useState } from 'react'
import {
  Modal,
  Row,
  Col,
  Form,
  Button,
  Table,
  Container,
} from 'react-bootstrap'
import { FaEdit, FaEllipsisH, FaPlus, FaTrash } from 'react-icons/fa'
import Loader from '../../components/Loader'
import Message from '../../components/Message'
import { toast } from 'react-toastify'
import { LinkContainer } from 'react-router-bootstrap'
import {
  useGetLocalsQuery,
  useAddLocalMutation,
  useDeleteLocalMutation,
} from '../../slices/localSlice'

const LocalListScreen = () => {
  const [show, setShow] = useState(false)
  const handleClose = () => {
    setShow(false)
    setName('')
  }
  const handleShow = () => setShow(true)
  const [name, setName] = useState('')

  const { data: locals, refetch, isLoading, error } = useGetLocalsQuery()
  const [addLocal, { isLoading: loadingAdd, error: errorAdd }] =
    useAddLocalMutation()
  const [deleteLocal, { isLoading: loadingDelete, error: errorDelete }] =
    useDeleteLocalMutation()

  const submitHandler = async (e) => {
    e.preventDefault()
    await addLocal({ name })
    refetch()
    handleClose()
    try {
    } catch (error) {
      toast.error(error?.data?.message || error.error)
    }
  }

  const deleteHandler = async (id) => {
    if (window.confirm('Are you sure!')) {
      try {
        await deleteLocal(id)
        refetch()
      } catch (error) {
        toast.error(error?.data?.message || error.error)
      }
    }
  }
  return (
    <Container>
      <Row className='justify-content-md-center'>
        <h1> المحليات</h1>
        <Col md={7}>
          <>
            <Button
              variant='outline-success'
              onClick={handleShow}
              style={{ marginBottom: '10px' }}
            >
              <FaPlus /> اضافة محلية
            </Button>
            <Modal show={show} onHide={handleClose}>
              <Modal.Header closeButton>
                <Modal.Title>اضافة محلية</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form>
                  <Form.Group controlId='local'>
                    <Form.Control
                      type='text'
                      placeholder='ادخل اسم المحلية'
                      autoFocus
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    ></Form.Control>
                  </Form.Group>
                </Form>
              </Modal.Body>
              <Modal.Footer>
                <Button variant='secondary' onClick={handleClose}>
                  اغلاق
                </Button>
                <Button variant='primary' onClick={submitHandler}>
                  حفظ
                </Button>
              </Modal.Footer>
            </Modal>
            {loadingAdd && <Loader />}
            {errorDelete && (
              <Message variant='danger'>
                {errorDelete?.data?.message || errorDelete.error}
              </Message>
            )}
            {loadingDelete && <Loader />}
            {errorAdd && (
              <Message variant='danger'>
                {errorAdd?.data?.message || error.error}
              </Message>
            )}
            {isLoading ? (
              <Loader />
            ) : error ? (
              <Message variant='danger'>
                {error?.data?.message || error.error}
              </Message>
            ) : (
              <Table
                striped
                bordered
                responsive
                hover
                className='table-sm mt-2'
              >
                <thead>
                  <tr>
                    <th>الرقم</th>
                    <th>المحلية</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {locals.map((local, index) => (
                    <tr key={local._id}>
                      <td>
                        <strong>{index + 1}</strong>
                      </td>
                      <td>
                        <strong>{local.name}</strong>{' '}
                        <LinkContainer
                          to={`/admin/local/${local._id}/unitlist`}
                          style={{ float: 'left', marginLeft: '10px' }}
                        >
                          <FaEllipsisH />
                        </LinkContainer>
                      </td>
                      <td className='text-center'>
                        <LinkContainer
                          to={`/admin/localedit/${local._id}/edit`}
                          style={{ marginLeft: '10px' }}
                        >
                          <Button variant='light' className='btn-sm'>
                            <FaEdit />
                          </Button>
                        </LinkContainer>
                        <Button
                          variant='danger'
                          className='btn-sm'
                          style={{ color: 'white' }}
                          onClick={() => deleteHandler(local._id)}
                        >
                          <FaTrash />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </>
        </Col>
      </Row>
    </Container>
  )
}

export default LocalListScreen
