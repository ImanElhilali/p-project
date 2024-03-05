import { useEffect, useState } from 'react'
import { Modal, Form, Button, Table, Row, Col } from 'react-bootstrap'
import { useParams, useNavigate } from 'react-router-dom'
import { FaPlus, FaTrash, FaEdit } from 'react-icons/fa'
import { LinkContainer } from 'react-router-bootstrap'
import Loader from '../components/Loader'
import Message from '../components/Message'
import moment from 'moment'
import Paginate from '../components/Paginate'
import SearchBox from '../components/SearchBox'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import {
  useGetTransactionsForPaginationQuery,
  useGetTransactionsQuery,
  useAddTransactionMutation,
  useDeleteTransactionMutation,
} from '../slices/transactionSlice'
import { useGetPumpTypesQuery } from '../slices/pumpTypeSlices'
import { useGetRepositoryQuery } from '../slices/repositorySlice'
import { useGetCompaniesQuery } from '../slices/companySlice'
import { useGetAgentsQuery } from '../slices/agentSlice'
import { useGetLocalsQuery } from '../slices/localSlice'
import { useGetPumpsQuery } from '../slices/pumpSlice'
import { toast } from 'react-toastify'

const TransactionListScreen = () => {
  const { page, keyword } = useParams()

  const [date, setDate] = useState(Date.now())
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

  const [show, setShow] = useState(false)
  const handleShow = () => setShow(true)
  const handleClose = () => {
    setShow(false)
    setDate(new Date())
    setCarNo('')
    setPumpType('')
    setRepository('')
    setCompany('')
    setAgent('')
    setDoctype('')
    setLocal('')
    setUnit('')
    setPump('')
    setApprovedQty()
    setArrivedQty()
    setCost()
    setPaid()
  }

  const ArrPumps = []

  const [agentTransactions, setAgentTransactions] = useState([])

  const { data, refetch, isLoading, error } =
    useGetTransactionsForPaginationQuery({
      keyword,
      page,
    })
  const { data: transactions } = useGetTransactionsQuery()

  const [addTransaction, { isLoading: loadingAdd }] =
    useAddTransactionMutation()
  const [deleteTransaction, { isLoading: loadingDelete, error: errorDelete }] =
    useDeleteTransactionMutation()

  const { data: pumpTypes } = useGetPumpTypesQuery()
  const { data: pumps } = useGetPumpsQuery()
  const { data: repositories } = useGetRepositoryQuery()
  const { data: companies } = useGetCompaniesQuery()
  const { data: agents } = useGetAgentsQuery()
  const { data: locals } = useGetLocalsQuery()
  const docTypes = ['تعهد', 'تصريح']

  const submitHandler = async (e) => {
    e.preventDefault()
    try {
      await addTransaction({
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
      setDate(new Date())
      setCarNo('')
      setPumpType('')
      setRepository('')
      setCompany('')
      setAgent('')
      setDoctype('')
      setLocal('')
      setUnit('')
      setPump('')
      setApprovedQty()
      setArrivedQty()
      setCost()
      setPaid()
      handleClose()
    } catch (error) {
      toast.error(error?.data?.message || error.error)
    }
  }

  useEffect(() => {
    if (pumpTypes && pumps && repositories && companies && agents && locals) {
      setPumpTypesData(pumpTypes)
      setPumpsData(pumps)
      setRepositoriesData(repositories)
      setCompaniesData(companies)
      setAgentsData(agents)
      setLocalsData(locals)
    }
  }, [pumpTypes, repositories, pumps, companies, agents, locals])

  useEffect(() => {
    if (company && local) {
      const ArrPumps = pumps.filter(
        (pump) => pump.company === company && pump.local === local
      )
      setPumpsForCompany(ArrPumps)
      setAgentsForCompany(ArrPumps)
      console.log(ArrPumps)
    }
  }, [company, local])

  useEffect(() => {
    if (local) {
      const selectedLocal = localsData.find((loc) => loc.name === local)
      setUnitsData(selectedLocal.units)
    }
  }, [local, localsData])

  useEffect(() => {
    if (local && company) {
      pumpsData.forEach((pump) =>
        pump.local === local && pump.company === company
          ? ArrPumps.push(pump)
          : null
      )
      setPumpsData(ArrPumps)
    }
  }, [local, company, pumpsData])

  useEffect(() => {
    if (keyword) {
      const agentTransactions = transactions.filter((transaction) =>
        transaction.agent.includes(keyword)
      )
      setAgentTransactions(agentTransactions)
    }
  }, [keyword])

  const deleteHandler = async (id) => {
    if (window.confirm('Are you sure!')) {
      try {
        await deleteTransaction(id)
        refetch()
      } catch (error) {
        toast.error(error?.data?.message || error.error)
      }
    }
  }

  const { timeZone: localTZ } = Intl.DateTimeFormat().resolvedOptions()
  const apiTZ = 'utc'
  const [apiTime, setApiTime] = useState(moment.utc())

  return (
    <>
      <h1
        style={{
          display: 'inline-block',
          marginLeft: '20px',
          marginRight: '40px',
          marginTop: '-10px',
          marginBottom: '-10px',
        }}
      >
        المعاملات
      </h1>
      <Row className='justify-content-md-start mb-3'>
        <Col md={4}>
          <Button
            variant='outline-success'
            onClick={handleShow}
            style={{
              marginRight: '200px',
              marginTop: '5px',
            }}
          >
            <FaPlus /> اضافة معاملة
          </Button>
        </Col>
        <Col md={5}>
          <SearchBox search='ابحث باسم الوكيل' searchComponent='transaction' />
        </Col>
      </Row>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title> اضافة معاملة</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row className='my-2'>
              <Col md={6}>
                <Form.Group controlId='transaction'>
                  <DatePicker
                    className='form-control dateInput'
                    placeholderText='Date'
                    // selected={date}
                    // onChange={(date) => setDate(date)}
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
                    {/* {agentsData.forEach((agent) =>
                      agent.company === company ? Arr.push(agent) : null
                    )} */}
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
            حفظ
          </Button>
        </Modal.Footer>
      </Modal>
      {loadingAdd && <Loader />}
      {/* {errorAdd && (
        <Message variant='danger'>
          {errorAdd?.data?.message || errorAdd.error}
        </Message>
      )} */}
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
          {keyword ? (
            <Table
              responsive
              bordered
              hover
              striped
              className='table-sm'
              style={{ fontSize: '14px' }}
            >
              <thead>
                <tr>
                  <th>التاريخ</th>
                  <th>رقم العربة</th>
                  <th>نوع الوقود</th>
                  <th>المستودع</th>
                  <th>الشركة</th>
                  <th>الوكيل</th>
                  <th>نوع المستند</th>
                  <th>المحلية</th>
                  <th>الوحدة الادارية</th>
                  <th>الطلمبة</th>
                  <th>المصدق</th>
                  <th>الواصل</th>
                  <th>المتبقي</th>
                  <th>التكلفة</th>
                  <th>المدفوع</th>
                  <th>المتبقي</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {agentTransactions.map((trans) => (
                  <tr key={trans._id}>
                    <td>{moment(trans.date).format('DD/MM/YYYY')}</td>
                    <td>{trans.carNo}</td>
                    <td>{trans.pumpType}</td>
                    <td>{trans.repository}</td>
                    <td>{trans.company}</td>
                    <td>{trans.agent}</td>
                    <td>{trans.docType}</td>
                    <td>{trans.local}</td>
                    <td>{trans.unit}</td>
                    <td>{trans.pump}</td>
                    <td>{trans.approvedQty}</td>
                    <td>{trans.arrivedQty}</td>
                    <td>{trans.approvedQty - trans.arrivedQty}</td>
                    <td>{trans.cost}</td>
                    <td>{trans.paid}</td>
                    <td>{trans.cost - trans.paid}</td>
                    <td className='text-center'>
                      <LinkContainer
                        to={`/transaction/${trans._id}/edit`}
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
                        onClick={() => deleteHandler(trans._id)}
                      >
                        <FaTrash />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <>
              <Table
                responsive
                bordered
                hover
                striped
                className='table-sm'
                style={{ fontSize: '14px' }}
              >
                <thead>
                  <tr>
                    <th>التاريخ</th>
                    <th>رقم العربة</th>
                    <th>نوع الوقود</th>
                    <th>المستودع</th>
                    <th>الشركة</th>
                    <th>الوكيل</th>
                    <th>نوع المستند</th>
                    <th>المحلية</th>
                    <th>الوحدة الادارية</th>
                    <th>الطلمبة</th>
                    <th>المصدق</th>
                    <th>الواصل</th>
                    <th>المتبقي</th>
                    <th>التكلفة</th>
                    <th>المدفوع</th>
                    <th>المتبقي</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {data.transactions.map((trans) => (
                    <tr key={trans._id}>
                      <td>{moment(trans.date).format('DD/MM/YYYY')}</td>
                      <td>{trans.carNo}</td>
                      <td>{trans.pumpType}</td>
                      <td>{trans.repository}</td>
                      <td>{trans.company}</td>
                      <td>{trans.agent}</td>
                      <td>{trans.docType}</td>
                      <td>{trans.local}</td>
                      <td>{trans.unit}</td>
                      <td>{trans.pump}</td>
                      <td>{trans.approvedQty}</td>
                      <td>{trans.arrivedQty}</td>
                      <td>{trans.approvedQty - trans.arrivedQty}</td>
                      <td>{trans.cost}</td>
                      <td>{trans.paid}</td>
                      <td>{trans.cost - trans.paid}</td>
                      <td className='text-center'>
                        <LinkContainer
                          to={`/transaction/${trans._id}/edit/${data.page}`}
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
                          onClick={() => deleteHandler(trans._id)}
                        >
                          <FaTrash />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              <Paginate pages={data.pages} page={data.page} isAdmin={false} />
            </>
          )}
        </>
      )}
    </>
  )
}

export default TransactionListScreen
