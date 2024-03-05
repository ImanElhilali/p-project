import { useState, useEffect } from 'react'
import {
  Form,
  Button,
  Table,
  Modal,
  Row,
  Col,
  Container,
} from 'react-bootstrap'
import { FaEdit, FaPlus, FaTrash } from 'react-icons/fa'
import { Link, useParams } from 'react-router-dom'
import { LinkContainer } from 'react-router-bootstrap'
import {
  useGetLocalQuery,
  useAddUnitMutation,
  useDeleteUnitMutation,
} from '../../slices/localSlice'
import Loader from '../../components/Loader'
import Message from '../../components/Message'
import { toast } from 'react-toastify'

const UnitListScreen = () => {
  const { id } = useParams()

  const { data: local, refetch, isLoading, error } = useGetLocalQuery(id)
  const [addUnit, { isLoading: loaddingAdd, error: errorAdd }] =
    useAddUnitMutation()
  const [deleteUnit, { isLoading: loadingDelete, error: errorDelete }] =
    useDeleteUnitMutation()

  const [unit, setUnit] = useState('')
  const [units, setUnits] = useState([])
  const [show, setShow] = useState(false)
  const handleClose = () => {
    setShow(false)
    setUnit('')
  }
  const handleShow = () => setShow(true)

  const deleteHandler = async (id, unitID) => {
    if (window.confirm('Are you sure !')) {
      try {
        await deleteUnit({ id, unitID })
        refetch()
      } catch (error) {
        toast.error(error?.data?.message || error.error)
      }
    }
  }

  const submitHandler = async (e) => {
    e.preventDefault()
    try {
      await addUnit({ _id: id, unit })
      refetch()
      handleClose()
    } catch (error) {
      toast.error(error?.data?.message || error.error)
    }
  }

  useEffect(() => {
    if (local) {
      setUnits(local.units)
    }
  }, [local])
  return (
    <Container>
      <Row className='justify-content-md-center'>
        <h1> الوحدات الادارية</h1>
        <Col md={7}>
          <Button
            variant='outline-success'
            onClick={handleShow}
            style={{ marginBottom: '20px', marginTop: '20px' }}
          >
            <FaPlus /> اضافة وحدة ادارية
          </Button>
          <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>اضافة وحدة ادارية</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Group controlId='local'>
                  <Form.Control
                    type='text'
                    placeholder='ادخل اسم الوحدة الادارية'
                    autoFocus
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
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
          <Link
            to={`/admin/locallist`}
            className='btn btn-light'
            style={{ float: 'left', marginRight: '20px' }}
          >
            تراجع
          </Link>
          {loadingDelete && <Loader />}
          {errorDelete && (
            <Message variant='danger'>
              {errorDelete?.data?.message || errorDelete.error}
            </Message>
          )}
          {loaddingAdd && <Loader />}
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
            <Table
              striped
              bordered
              responsive
              hover
              className='table-sm'
              style={{ marginTop: '10px' }}
            >
              <thead>
                <tr>
                  <th>الرقم</th>
                  <th>الوحدة الادارية</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {units.map((unit, index) => (
                  <tr key={unit._id}>
                    <td>
                      <strong>{index + 1}</strong>
                    </td>
                    <td>
                      <strong>{unit.unit}</strong>
                    </td>
                    <td className='text-center'>
                      <LinkContainer
                        to={`/admin/local/${id}/unitedit/${unit._id}/edit`}
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
                        onClick={() => deleteHandler(id, unit._id)}
                      >
                        <FaTrash />
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

export default UnitListScreen
