import { useState, useEffect } from 'react'
import { Modal, Form, Button, Row, Col } from 'react-bootstrap'
import { useParams, useNavigate } from 'react-router-dom'
import DatePicker from 'react-datepicker'
import moment from 'moment'
import 'moment-timezone'
import 'react-datepicker/dist/react-datepicker.css'
import { toast } from 'react-toastify'
import {
  useGetTransactionByIdQuery,
  useUpdateTransactionMutation,
} from '../slices/transactionSlice'
import { useGetPumpTypesQuery } from '../slices/pumpTypeSlices'
import { useGetRepositoryQuery } from '../slices/repositorySlice'
import { useGetCompaniesQuery } from '../slices/companySlice'
import { useGetAgentsQuery } from '../slices/agentSlice'
import { useGetLocalsQuery } from '../slices/localSlice'
import { useGetPumpsQuery } from '../slices/pumpSlice'
const TransactionEditScreen = () => {
  const { id, page } = useParams()
  const navigate = useNavigate()

  const [show, setShow] = useState(true)
  const handleClose = () => {
    setShow(false)
    navigate(`/transactions/page/${page}`)
  }
  const [date, setDate] = useState(new Date())
  const [carNo, setCarNo] = useState('')
  const [pumpType, setPumpType] = useState('')
  const [repository, setRepository] = useState('')
  const [company, setCompany] = useState('')
  const [agent, setAgent] = useState('')
  const [docType, setDoctype] = useState('')
  const [local, setLocal] = useState('')
  const [unit, setUnit] = useState('')
  const [pump, setPump] = useState('')
  const [approvedQty, setApprovedQty] = useState()
  const [arrivedQty, setArrivedQty] = useState()
  const [cost, setCost] = useState()
  const [paid, setPaid] = useState()

  const [pumpTypesData, setPumpTypesData] = useState([])
  const [pumpsData, setPumpsData] = useState([])
  const [repositoriesData, setRepositoriesData] = useState([])
  const [companiesData, setCompaniesData] = useState([])
  const [agentsData, setAgentsData] = useState([])
  const [localsData, setLocalsData] = useState([])
  const [unitsData, setUnitsData] = useState([])

  const [pumpsForCompany, setPumpsForCompany] = useState([])
  const [agentsForCompany, setAgentsForCompany] = useState([])

  const { data: transaction, refetch } = useGetTransactionByIdQuery(id)
  const [updateTransaction] = useUpdateTransactionMutation()

  const { data: pumpTypes } = useGetPumpTypesQuery()
  const { data: pumps } = useGetPumpsQuery()
  const { data: repositories } = useGetRepositoryQuery()
  const { data: companies } = useGetCompaniesQuery()
  const { data: agents } = useGetAgentsQuery()
  const { data: locals } = useGetLocalsQuery()
  const docTypes = ['تعهد', 'تصريح']

  const ArrPumps = []

  const submitHandler = async (e) => {
    e.preventDefault()
    try {
      await updateTransaction({
        id,
        date,
        carNo,
        pumpType,
        repository,
        company,
        agent,
        docType,
        local,
        unit,
        pump,
        approvedQty,
        arrivedQty,
        cost,
        paid,
      }).unwrap()
      refetch()
      navigate(`/transactions/page/${page}`)
    } catch (error) {
      toast.error(error?.data?.message || error.error)
    }
  }

  useEffect(() => {
    if (
      transaction &&
      pumpTypes &&
      pumps &&
      repositories &&
      companies &&
      agents &&
      locals
    ) {
      setDate(transaction.date)
      setCarNo(transaction.carNo)
      setPumpType(transaction.pumpType)
      setRepository(transaction.repository)
      setCompany(transaction.company)
      setAgent(transaction.agent)
      setDoctype(transaction.docType)
      setLocal(transaction.local)
      setUnit(transaction.unit)
      setPump(transaction.pump)
      setApprovedQty(transaction.approvedQty)
      setArrivedQty(transaction.arrivedQty)
      setCost(transaction.cost)
      setPaid(transaction.paid)
      setPumpTypesData(pumpTypes)
      setPumpsData(pumps)
      setRepositoriesData(repositories)
      setCompaniesData(companies)
      setAgentsData(agents)
      setLocalsData(locals)
    }
  }, [transaction, pumpTypes, pumps, repositories, companies, agents, locals])

  useEffect(() => {
    if (company && local) {
      const ArrPumps = pumps.filter(
        (pump) => pump.company === company && pump.local === local
      )
      setPumpsForCompany(ArrPumps)
      setAgentsForCompany(ArrPumps)
    }
  }, [company, local])

  useEffect(() => {
    if (local) {
      const selectedLocal = localsData.find((loc) => loc.name === local)
      setUnitsData(selectedLocal.units)
    }
  }, [local])

  useEffect(() => {
    if (local && company) {
      pumpsData.forEach((pump) =>
        pump.local === local && pump.company === company
          ? ArrPumps.push(pump)
          : null
      )
      setPumpsData(ArrPumps)
    }
  }, [local, company])

  const { timeZone: localTZ } = Intl.DateTimeFormat().resolvedOptions()
  const apiTZ = 'utc'
  const [apiTime, setApiTime] = useState(moment.utc())

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title> تعديل معاملة</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Row className='my-2'>
            <Col md={6}>
              <Form.Group controlId='transaction'>
                <DatePicker
                  className='form-control dateInput'
                  value={moment(date).format('DD/MM/YYYY')}
                  onChange={(date) => {
                    const apiTimesFromPickerLocalDate = moment(
                      date.setHours(0, 0, 0, 0)
                    )
                      .tz(localTZ)
                      .tz(apiTZ, true)
                      .format()
                    setApiTime(apiTimesFromPickerLocalDate)
                    setDate(apiTimesFromPickerLocalDate)
                  }}
                  selected={moment(apiTime)
                    .tz(apiTZ)
                    .tz(localTZ, true)
                    .toDate()}
                  dateFormat='dd/MM/yyyy'
                />
                <br />
              </Form.Group>
            </Col>
            <Col md={1}></Col>
            <Col md={5}>
              <Form.Group controlId='carNo'>
                <Form.Control
                  type='text'
                  placeholder='ادخل رقم العربة '
                  autoFocus
                  value={carNo}
                  onChange={(e) => setCarNo(e.target.value)}
                ></Form.Control>
              </Form.Group>
            </Col>
          </Row>
          <Row className='my-2'>
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
              <Form.Group controlId='repository'>
                <Form.Select
                  aria-label='Default select example'
                  value={repository}
                  onChange={(e) => {
                    setRepository(e.target.value)
                  }}
                >
                  <option selected value=''>
                    اختر المستودع
                  </option>
                  {repositoriesData.map((repository) => (
                    <option key={repository._id} value={repository.name}>
                      {repository.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
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
            </Col>
            <Col md={1}></Col>
            <Col md={5}>
              <Form.Group controlId='local'>
                <Form.Select
                  aria-label='Default select example'
                  value={local}
                  onChange={(e) => {
                    setLocal(e.target.value)
                  }}
                >
                  <option selected value=''>
                    اختر المحلية
                  </option>
                  {localsData.map((local) => (
                    <option key={local._id} value={local.name}>
                      {local.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
          <Row className='my-2'>
            <Col md={6}>
              <Form.Group controlId='unit'>
                <Form.Select
                  aria-label='Default select example'
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                >
                  <option selected value=''>
                    اختر الوحدة الادارية
                  </option>
                  {unitsData.map((unit) => (
                    <option key={unit._id} value={unit.unit}>
                      {unit.unit}
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
                  <option selected value=''>
                    اختر الوكيل
                  </option>
                  {agentsForCompany.map((agent) => (
                    <option key={agent._id} value={agent.agent}>
                      {agent.agent}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
          <Row className='my-2'>
            <Col md={6}>
              <Form.Group controlId='pump'>
                <Form.Select
                  aria-label='Default select example'
                  value={pump}
                  onChange={(e) => setPump(e.target.value)}
                >
                  <option selected value=''>
                    اختر الطلمبة
                  </option>
                  {pumpsForCompany.map((pump) => (
                    <option key={pump._id} value={pump.pump}>
                      {pump.pump}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={1}></Col>
            <Col md={5}>
              <Form.Group controlId='doctype'>
                <Form.Select
                  aria-label='Default select example'
                  value={docType}
                  onChange={(e) => {
                    setDoctype(e.target.value)
                  }}
                >
                  <option selected value=''>
                    اختر نوع المستند
                  </option>
                  {docTypes.map((docType, index) => (
                    <option key={index} value={docType}>
                      {docType}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
          <Row className='my-2'>
            <Col md={6}>
              <Form.Group controlId='approvedQty'>
                <Form.Control
                  type='number'
                  placeholder='ادخل الكمية المصدقة'
                  autoFocus
                  value={approvedQty}
                  onChange={(e) => setApprovedQty(e.target.value)}
                ></Form.Control>
              </Form.Group>
            </Col>
            <Col md={1}></Col>
            <Col md={5}>
              <Form.Group controlId='arrivedQty'>
                <Form.Control
                  type='number'
                  placeholder='ادخل الكمية الواصلة'
                  autoFocus
                  value={arrivedQty}
                  onChange={(e) => setArrivedQty(e.target.value)}
                ></Form.Control>
              </Form.Group>
            </Col>
          </Row>
          <Row className='my-2'>
            <Col md={6}>
              <Form.Group controlId='cost'>
                <Form.Control
                  type='number'
                  placeholder='التكلفة'
                  autoFocus
                  value={cost}
                  onChange={(e) => setCost(e.target.value)}
                ></Form.Control>
              </Form.Group>
            </Col>
            <Col md={1}></Col>
            <Col md={5}>
              <Form.Group controlId='arrivedQty'>
                <Form.Control
                  type='number'
                  placeholder='المدفوع'
                  autoFocus
                  value={paid}
                  onChange={(e) => setPaid(e.target.value)}
                ></Form.Control>
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
  )
}

export default TransactionEditScreen
