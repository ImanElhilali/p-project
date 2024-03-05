import { useState, useEffect } from 'react'
import { Col, Row, Form, Button, Modal } from 'react-bootstrap'
import { useParams, useNavigate } from 'react-router-dom'
import {
  useGetLocalsQuery,
  useGetLocalQuery,
  useUpdateLocalMutation,
} from '../../slices/localSlice'
import { toast } from 'react-toastify'

const LocalEditScreen = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [show, setShow] = useState(true)
  const handleClose = () => {
    setShow(false)
    navigate('/admin/locallist')
  }

  const { data: locals } = useGetLocalsQuery()
  const { data: local, refetch } = useGetLocalQuery(id)
  const [updateLocal] = useUpdateLocalMutation()

  useEffect(() => {
    if (local) {
      setName(local.name)
    }
  }, [local])

  const handleValidation = () => {
    let formIsValid = true

    const restOfLocals = locals.filter((local) => local._id !== id)
    const namesOfLocals = restOfLocals.map((local) => local.name)
    const nameExists = namesOfLocals.find((local) => local === name)
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
        await updateLocal({ _id: id, name })
        refetch()
        navigate('/admin/locallist')
        handleClose()
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
            <Modal.Title>تعديل اسم المحلية</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId='local' className='my-2'>
                <Form.Control
                  type='text'
                  placeholder='تعديل اسم المحلية'
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

export default LocalEditScreen
