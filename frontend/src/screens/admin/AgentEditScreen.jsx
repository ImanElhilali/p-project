import { useState, useEffect } from 'react'
import { Form, Button, Modal } from 'react-bootstrap'
import { useParams, useNavigate } from 'react-router-dom'
import {
  useGetAgentByIdQuery,
  useUpdateAgentMutation,
} from '../../slices/agentSlice'
import { useGetCompaniesQuery } from '../../slices/companySlice'
import { toast } from 'react-toastify'

const AgentEditScreen = () => {
  const { id, page } = useParams()
  const navigate = useNavigate()

  const [show, setShow] = useState(true)

  const handleClose = () => {
    setShow(false)
    navigate(`/admin/agentlist/page/${page}`)
  }

  const [companiesData, setCompaniesData] = useState([])

  const [company, setCompany] = useState('')
  const [agent, setAgent] = useState('')

  const { data: companies } = useGetCompaniesQuery()
  const { data: agentData, refetch } = useGetAgentByIdQuery(id)

  const [updateAgent] = useUpdateAgentMutation()

  const submitHandler = async (e) => {
    e.preventDefault()
    try {
      await updateAgent({ id, company, agent }).unwrap()
      refetch()
      navigate(`/admin/agentlist/page/${page}`)
      handleClose()
    } catch (error) {
      toast.error(error?.data?.message || error.error)
    }
  }

  useEffect(() => {
    if (companies && agentData) {
      setCompaniesData(companies)
      setCompany(agentData.company)
      setAgent(agentData.agent)
    }
  }, [companies, agentData])

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>تعديل بيانات الوكيل</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId='company' className='my-2'>
            <Form.Label>اختر الشركة</Form.Label>
            <Form.Select
              aria-label='Default select example'
              value={company}
              onChange={(e) => setCompany(e.target.value)}
            >
              <option selected value=''>
                اختر الشركة
              </option>
              {companiesData.map((company) => (
                <option key={company._id} value={company.name}>
                  {company.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          <Form.Group
            controlId='agent'
            style={{ marginBottom: '25px', marginTop: '20px' }}
          >
            <Form.Label> اسم الوكيل</Form.Label>
            <Form.Control
              type='text'
              value={agent}
              onChange={(e) => setAgent(e.target.value)}
            ></Form.Control>
          </Form.Group>
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
  )
}

export default AgentEditScreen
