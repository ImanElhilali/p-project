import { useState, useEffect } from 'react'
import { Modal, Row, Col, Form, Button } from 'react-bootstrap'
import { useParams, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import {
  useGetPumpTypesQuery,
  useGetPumpTypeByIdQuery,
  useUpdatePumpTypeMutation,
} from '../../slices/pumpTypeSlices'

const PumpTypeEditScreen = () => {
  const [type, setType] = useState('')
  const [error, setError] = useState('')
  const [show, setShow] = useState(true)
  const handleClose = () => {
    setShow(false)
    navigate('/admin/pumpTyplist')
  }

  const { id } = useParams()
  const navigate = useNavigate()
  const { data: pumpTypes } = useGetPumpTypesQuery()
  const { data: pumpType, refetch } = useGetPumpTypeByIdQuery(id)
  const [updateType] = useUpdatePumpTypeMutation()

  useEffect(() => {
    if (pumpType) {
      setType(pumpType.type)
    }
  }, [pumpType])

  const handleValidation = () => {
    let formIsValid = true

    const restOfPumpTypes = pumpTypes.filter((pump) => pump._id !== id)
    const namesOfPumpTypes = restOfPumpTypes.map((pump) => pump.type)
    const nameExists = namesOfPumpTypes.find((pumpName) => pumpName === type)
    if (nameExists) {
      setError('هذا الاسم موجود مسبقاً')
      console.log(nameExists)
      formIsValid = false
    }

    return formIsValid
  }

  const submitHandler = async (e) => {
    e.preventDefault()
    if (handleValidation()) {
      try {
        await updateType({ id, type }).unwrap()
        navigate('/admin/pumpTyplist')
        refetch()
      } catch (error) {
        toast.error(error?.data?.message || error.error)
      }
    }
  }

  return (
    <Row className='justify-content-md-center'>
      <Col md={6}>
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>تعديل نوع الوقود</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId='pumpType'>
                <Form.Control
                  type='text'
                  autoFocus
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                ></Form.Control>
                <br />
                <span style={{ color: 'red' }}>{error}</span>
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant='outline-success' onClick={handleClose}>
              اغلاق
            </Button>
            <Button variant='success' onClick={submitHandler}>
              تعديل
            </Button>
          </Modal.Footer>
        </Modal>
      </Col>
    </Row>
  )
}

export default PumpTypeEditScreen
