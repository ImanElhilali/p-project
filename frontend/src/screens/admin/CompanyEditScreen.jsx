import { useState, useEffect } from 'react'
import { Form, Button, Modal } from 'react-bootstrap'
import { useNavigate, useParams } from 'react-router-dom'
import {
  useGetCompanyQuery,
  useUpdateCompanyMutation,
} from '../../slices/companySlice'
import { toast } from 'react-toastify'

const CompanyEditScreen = () => {
  const { id, page } = useParams()
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [show, setShow] = useState(true)

  const handleClose = () => {
    setShow(false)
    navigate(`/admin/companylist/page/${page}`)
  }

  const { data: company, refetch } = useGetCompanyQuery(id)
  const [updateCompany] = useUpdateCompanyMutation()

  useEffect(() => {
    if (company) {
      setName(company.name)
    }
  }, [company])

  const submitHandler = async (e) => {
    e.preventDefault()
    try {
      await updateCompany({ id, name }).unwrap()
      navigate(`/admin/companylist/page/${page}`)
      handleClose()
      refetch()
    } catch (error) {
      toast.error(error?.data?.message || error.error)
    }
  }
  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title> اضافة معاملة</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId='company' style={{ marginBottom: '25px' }}>
              <Form.Control
                type='text'
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
              ></Form.Control>
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
    </>
  )
}

export default CompanyEditScreen
