import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Modal, Form, Button, Row, Col } from 'react-bootstrap'
import {
  useGetUnitQuery,
  useGetUnitsQuery,
  useUpdateUnitMutation,
} from '../../slices/localSlice'
import { toast } from 'react-toastify'

const UnitEditScreen = () => {
  const { id, unitID } = useParams()
  const navigate = useNavigate()

  const [show, setShow] = useState(true)
  const handleClose = () => {
    setShow(false)
    navigate(`/admin/local/${id}/unitlist`)
  }

  const [name, setName] = useState('')
  const [error, setError] = useState('')

  const { data: local } = useGetUnitsQuery(id)
  const { data: unit, refetch } = useGetUnitQuery({ id, unitID })
  const [updateUnit] = useUpdateUnitMutation()

  useEffect(() => {
    if (unit) {
      setName(unit.unit)
    }
  }, [unit])

  const handleValidation = () => {
    let formIsValid = true
    const Arr = []
    local.units.forEach((unit) => Arr.push(unit))

    const restOfUnits = Arr.filter((unit) => unit._id !== unitID)
    const namesOfUnits = restOfUnits.map((unit) => unit.unit)
    const nameExists = namesOfUnits.find((unit) => unit === name)
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
        await updateUnit({ id, unit: name, unitID })
        refetch()
        navigate(`/admin/local/${id}/unitlist`)
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
            <Modal.Title>تعديل اسم الوحدة الادارية</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId='unit' className='my-2'>
                <Form.Control
                  type='text'
                  autoFocus
                  value={name}
                  onChange={(e) => setName(e.target.value)}
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

export default UnitEditScreen
