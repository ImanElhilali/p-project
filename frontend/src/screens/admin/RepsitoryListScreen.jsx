import { useState } from 'react'
import {
  Row,
  Col,
  Modal,
  Form,
  Button,
  Table,
  Container,
} from 'react-bootstrap'
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa'
import Loader from '../../components/Loader'
import Message from '../../components/Message'
import { toast } from 'react-toastify'
import { LinkContainer } from 'react-router-bootstrap'
import {
  useGetRepositoryQuery,
  useAddRepositoryMutation,
  useDeleteRepositoryMutation,
} from '../../slices/repositorySlice'

const RepsitoryListScreen = () => {
  const [name, setName] = useState('')
  const [show, setShow] = useState(false)
  const handleShow = () => setShow(true)
  const handleClose = () => {
    setShow(false)
    setName('')
  }

  const {
    data: repositories,
    refetch,
    isLoading,
    error,
  } = useGetRepositoryQuery()
  const [addRepository, { isLoading: loadingAdd, error: errorAdd }] =
    useAddRepositoryMutation()
  const [deleteRepository, { isLoading: loadingDelete, error: errorDelete }] =
    useDeleteRepositoryMutation()

  const submitHandler = async (e) => {
    e.preventDefault()
    try {
      await addRepository({ name })
      refetch()
      handleClose()
      setName('')
    } catch (error) {
      toast.error(error?.data?.message || error.error)
    }
  }

  const deleteHandler = async (id) => {
    if (window.confirm('Are you sure!')) {
      try {
        await deleteRepository(id)
        refetch()
        toast.success('تم حذف مستودع')
      } catch (error) {
        toast.error(error?.data?.message || error.error)
      }
    }
  }

  return (
    <Container>
      <Row className='justify-content-center'>
        <h1> المستودعات</h1>
        <Col md={7}>
          <Button
            variant='outline-success'
            onClick={handleShow}
            style={{ marginBottom: '10px', marginTop: '20px' }}
          >
            <FaPlus /> اضافة مستودع
          </Button>
          <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title> اضافة مستودع</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Group controlId='repository'>
                  <Form.Control
                    type='text'
                    placeholder='ادخل اسم المستودع'
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
          {errorAdd && (
            <Message variant='danger'>
              {errorAdd?.data?.message || errorAdd.error}
            </Message>
          )}
          {loadingDelete && <Loader />}
          {errorDelete && (
            <Message variant='danger'>
              {errorDelete?.data?.message || errorDelete.error}
            </Message>
          )}
          {isLoading ? (
            <Loader />
          ) : error ? (
            <Message variant='danger'>
              {error?.data?.message || error.error}
            </Message>
          ) : (
            <>
              <Table
                className='table-sm mt-2'
                hover
                responsive
                bordered
                striped
              >
                <thead>
                  <tr>
                    <th>الرقم</th>
                    <th>الاسم</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {repositories.map((repository, index) => (
                    <tr key={repository._id}>
                      <td>
                        <strong>{index + 1}</strong>
                      </td>
                      <td>
                        <strong>{repository.name}</strong>
                      </td>
                      <td className='text-center'>
                        <LinkContainer
                          to={`/admin/repository/${repository._id}/edit`}
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
                          onClick={() => deleteHandler(repository._id)}
                        >
                          <FaTrash />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </>
          )}
        </Col>
      </Row>
    </Container>
  )
}

export default RepsitoryListScreen
