import { useState } from 'react'
import {
  Modal,
  Form,
  Button,
  Row,
  Col,
  Table,
  Container,
} from 'react-bootstrap'
import Loader from '../../components/Loader'
import Message from '../../components/Message'
import { FaPlus, FaTrash, FaEdit } from 'react-icons/fa'
import { toast } from 'react-toastify'
import {
  useGetPumpTypesQuery,
  useAddPumpTypeMutation,
  useDeletePumpTypeMutation,
} from '../../slices/pumpTypeSlices'
import { LinkContainer } from 'react-router-bootstrap'

const PumpTypeListScreen = () => {
  const [type, setType] = useState('')
  const [show, setShow] = useState(false)
  const handleShow = () => setShow(true)
  const handleClose = () => setShow(false)

  const { data: pumpTypes, refetch, isLoading, error } = useGetPumpTypesQuery()
  const [addType, { isLoading: loadingAdd }] = useAddPumpTypeMutation()
  const [deleteType, { isLoading: loadingDelete }] = useDeletePumpTypeMutation()

  const submitHandler = async (e) => {
    e.preventDefault()
    try {
      await addType({ type }).unwrap()
      setType('')
      refetch()
      handleClose()
    } catch (error) {
      toast.error(error?.data?.message || error.error)
    }
  }
  const deleteHandler = async (id) => {
    if (window.confirm('Are you sure !')) {
      try {
        await deleteType(id).unwrap()
        refetch()
      } catch (error) {
        toast.error(error?.data?.message || error.error)
      }
    }
  }
  return (
    <Container>
      <Row className='justify-content-md-center'>
        <h1 style={{ display: 'inline-block' }}>نوع الوقود</h1>
        <Col md={7}>
          <Button
            variant='outline-success'
            onClick={handleShow}
            style={{ marginBottom: '20px', marginTop: '20px' }}
          >
            <FaPlus />
            اضافة نوع الوقود
          </Button>
          <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>اضافة نوع الوقود</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Group controlId='company'>
                  <Form.Control
                    type='text'
                    placeholder='ادخل نوع الوقود'
                    autoFocus
                    value={type}
                    onChange={(e) => setType(e.target.value)}
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
          {loadingDelete && <Loader />}
          {isLoading ? (
            <Loader />
          ) : error ? (
            <Message variant='danger'>
              {error?.data?.message || error.error}
            </Message>
          ) : (
            <Table hover bordered responsive striped className='table-sm'>
              <thead>
                <tr>
                  <th>الرقم</th>
                  <th>نوع الوقود</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {pumpTypes.map((type, index) => (
                  <tr key={type._id}>
                    <td>{index + 1}</td>
                    <td>
                      <strong>{type.type}</strong>
                    </td>
                    <td className='text-center'>
                      <LinkContainer
                        to={`/admin/pumpType/${type._id}/edit`}
                        style={{ marginLeft: '10px' }}
                      >
                        <Button variant='light' className='btn-sm'>
                          <FaEdit />
                        </Button>
                      </LinkContainer>
                      <Button
                        variant='danger'
                        className='btn-sm'
                        onClick={() => deleteHandler(type._id)}
                      >
                        <FaTrash style={{ color: 'white' }} />
                      </Button>
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

export default PumpTypeListScreen
