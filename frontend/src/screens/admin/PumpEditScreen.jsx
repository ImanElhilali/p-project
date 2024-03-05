import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Row, Col, Modal, Form, Button } from 'react-bootstrap'
import { toast } from 'react-toastify'
import {
  useGetPumpByIdQuery,
  useUpdatePumpMutation,
} from '../../slices/pumpSlice'
import { useGetCompaniesQuery } from '../../slices/companySlice'
import { useGetLocalsQuery } from '../../slices/localSlice'
import { useGetAgentsQuery } from '../../slices/agentSlice'
import { useGetPumpTypesQuery } from '../../slices/pumpTypeSlices'

const PumpEditScreen = () => {
  const { id, page } = useParams()
  const navigate = useNavigate()

  const { data: pumpData, refetch } = useGetPumpByIdQuery(id)
  const [updatePump] = useUpdatePumpMutation()

  const [show, setShow] = useState(true)

  const handleClose = () => {
    setShow(false)
    navigate(`/admin/pumplist/page/${page}`)
  }

  const [companiesData, setCompaniesData] = useState([])
  const [localsData, setLocalsData] = useState([])
  const [agentsData, setAgentsData] = useState([])
  const [pumpTypesData, setPumpTypesData] = useState([])
  const [unitsData, setUnitsData] = useState([])

  const [company, setCompany] = useState('')
  const [local, setLocal] = useState('')
  const [unit, setUnit] = useState('')
  const [agent, setAgent] = useState('')
  const [pumpType, setPumpType] = useState('')
  const [capacity, setCapacity] = useState(0)
  const [pump, setPump] = useState('')

  const { data: companies } = useGetCompaniesQuery()
  const { data: locals } = useGetLocalsQuery()
  const { data: agents } = useGetAgentsQuery()
  const { data: pumpTypes } = useGetPumpTypesQuery()

  const Arr = []

  useEffect(() => {
    if (companies && locals && agents && pumpTypes && pumpData) {
      setCompany(pumpData.company)
      setLocal(pumpData.local)
      setUnit(pumpData.unit)
      setAgent(pumpData.agent)
      setPumpType(pumpData.pumpType)
      setCapacity(pumpData.capacity)
      setPump(pumpData.pump)
      setCompaniesData(companies)
      setLocalsData(locals)
      setAgentsData(agents)
      setPumpTypesData(pumpTypes)
    }
  }, [companies, locals, agents, pumpTypes, pumpData])

  useEffect(() => {
    if (local) {
      const SelectedLocal = localsData.find((loc) => loc.name === local)
      let units = SelectedLocal.units.map((unit) => unit)
      setUnitsData(units)
    }
  }, [local])

  const submitHandler = async (e) => {
    e.preventDefault()
    try {
      await updatePump({
        id,
        company,
        local,
        unit,
        agent,
        pumpType,
        capacity,
        pump,
      }).unwrap()
      refetch()
      handleClose()
      navigate(`/admin/pumplist/page/${page}`)
    } catch (error) {
      toast.error(error?.data?.message || error.error)
    }
  }
  return (
    <Row className='justify-content-md-center'>
      <Col md={10}>
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>تعديل طلمبة</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Row>
                <Col md={6}>
                  <Form.Group controlId='company'>
                    <Form.Select
                      aria-label='Default select example'
                      value={company}
                      onChange={(e) => {
                        setCompany(e.target.value)
                      }}
                    >
                      <option selected defaultValue=''>
                        اختر الشركة
                      </option>
                      {companiesData.map((company) => (
                        <option key={company._id} value={company.name}>
                          {company.name}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={1}></Col>
                <Col md={5}>
                  <Form.Group controlId='agent'>
                    <Form.Select
                      aria-label='Default select example'
                      value={agent}
                      onChange={(e) => setAgent(e.target.value)}
                    >
                      <option value=''>اختر الوكيل</option>
                      {agentsData.forEach((agent) =>
                        agent.company === company ? Arr.push(agent) : null
                      )}
                      {Arr.map((agent) => (
                        <option key={agent._id} value={agent.agent}>
                          {agent.agent}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
              <Row className='mt-2'>
                <Col md={6}>
                  <Form.Group controlId='local'>
                    <Form.Select
                      aria-label='Default select example'
                      value={local}
                      onChange={(e) => {
                        setLocal(e.target.value)
                      }}
                    >
                      <option defaultValue=''>اختر المحلية</option>
                      {localsData.map((local) => (
                        <option key={local._id} value={local.name}>
                          {local.name}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={1}></Col>
                <Col md={5}>
                  <Form.Group controlId='unit'>
                    <Form.Select
                      aria-label='Default select example'
                      value={unit}
                      onChange={(e) => setUnit(e.target.value)}
                    >
                      <option defaultValue=''>اختر الوحدة الادارية</option>
                      {unitsData.map((unit) => (
                        <option key={unit._id} value={unit.unit}>
                          {unit.unit}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
              <Row className='mt-2'>
                <Col md={6}>
                  <Form.Group controlId='pumpType'>
                    <Form.Select
                      aria-label='Default select example'
                      value={pumpType}
                      onChange={(e) => {
                        setPumpType(e.target.value)
                      }}
                    >
                      <option selected value=''>
                        اختر نوع الوقود
                      </option>
                      {pumpTypesData.map((pumpType) => (
                        <option key={pumpType._id} value={pumpType.type}>
                          {pumpType.type}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={1}></Col>
                <Col md={5}>
                  <Form.Group controlId='capacity'>
                    <Form.Control
                      type='Number'
                      autoFocus
                      value={capacity}
                      onChange={(e) => setCapacity(e.target.value)}
                    ></Form.Control>
                  </Form.Group>
                </Col>
              </Row>
              <Row className='mt-2'>
                <Col md={6}>
                  <Form.Group controlId='pump'>
                    <Form.Control
                      type='text'
                      autoFocus
                      value={pump}
                      onChange={(e) => setPump(e.target.value)}
                    ></Form.Control>
                    {/* <br />
                    <span style={{ color: 'red' }}>{error}</span> */}
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
              تعديل
            </Button>
          </Modal.Footer>
        </Modal>
      </Col>
    </Row>
  )
}

export default PumpEditScreen
