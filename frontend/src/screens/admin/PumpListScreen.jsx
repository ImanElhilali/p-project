import { useState, useEffect } from 'react'
import { FaPlus, FaTrash, FaEdit } from 'react-icons/fa'
import {
  Col,
  Row,
  Form,
  Button,
  Modal,
  Table,
  Container,
} from 'react-bootstrap'
import { useParams } from 'react-router-dom'
import Paginate from '../../components/Paginate'
import SearchBox from '../../components/SearchBox'
import Loader from '../../components/Loader'
import Message from '../../components/Message'
import { toast } from 'react-toastify'
import { LinkContainer } from 'react-router-bootstrap'
import {
  useGetPumpsQuery,
  useGetPumpsForPaginationQuery,
  useAddPumpMutation,
  useDeletePumpMutation,
} from '../../slices/pumpSlice'
import { useGetCompaniesQuery } from '../../slices/companySlice'
import { useGetLocalsQuery } from '../../slices/localSlice'
import { useGetAgentsQuery } from '../../slices/agentSlice'
import { useGetPumpTypesQuery } from '../../slices/pumpTypeSlices'

const PumpListScreen = () => {
  const { keyword, page } = useParams()
  const [companiesData, setCompaniesData] = useState([])
  const [localsData, setLocalsData] = useState([])
  const [agentsData, setAgentsData] = useState([])
  const [pumpTypesData, setPumpTypesData] = useState([])
  const [unitsData, setUnitsData] = useState([])
  const Arr = []

  const { data: companies } = useGetCompaniesQuery()
  const { data: locals } = useGetLocalsQuery()
  const { data, refetch, isLoading, error } = useGetPumpsForPaginationQuery({
    keyword,
    page,
  })
  const { data: pumps } = useGetPumpsQuery()
  const { data: agents } = useGetAgentsQuery()
  const { data: pumpTypes } = useGetPumpTypesQuery()
  const [addPump, { isLoading: loadingAdd }] = useAddPumpMutation()
  const [deletePump, { isLoading: loadingDelete }] = useDeletePumpMutation()

  const [company, setCompany] = useState('')
  const [local, setLocal] = useState('')
  const [unit, setUnit] = useState('')
  const [agent, setAgent] = useState('')
  const [pumpType, setPumpType] = useState('')
  const [capacity, setCapacity] = useState()
  const [pump, setPump] = useState('')

  const [companyPumps, setCompanyPumps] = useState([])

  const [show, setShow] = useState(false)

  const handleShow = () => setShow(true)
  const handleClose = () => {
    setShow(false)
    setCompany('')
    setLocal('')
    setUnit('')
    setAgent('')
    setPumpType('')
    setCapacity('')
    setPump('')
  }

  const submitHandler = async (e) => {
    e.preventDefault()
    try {
      await addPump({
        company,
        agent,
        local,
        unit,
        pumpType,
        capacity,
        pump,
      }).unwrap()
      refetch()
      handleClose()
      setCompany('')
      setLocal('')
      setUnit('')
      setAgent('')
      setPumpType('')
      setCapacity('')
      setPump('')
    } catch (error) {
      toast.error(error?.data?.message || error.error)
    }
  }

  const deleteHandler = async (id) => {
    if (window.confirm('Are you Sure!')) {
      try {
        await deletePump(id).unwrap()
        refetch()
      } catch (error) {
        toast.error(error?.data?.message || error.error)
      }
    }
  }

  useEffect(() => {
    if (companies && locals && agents && pumpTypes) {
      setCompaniesData(companies)
      setLocalsData(locals)
      setAgentsData(agents)
      setPumpTypesData(pumpTypes)
    }
  }, [companies, locals, agents, pumpTypes])

  useEffect(() => {
    if (local) {
      const selectedLocal = localsData.find((loc) => loc.name === local)
      setUnitsData(selectedLocal.units)
    }
  }, [local, localsData])

  useEffect(() => {
    if (keyword) {
      const companyPumps = pumps.filter((pump) => pump.pump.includes(keyword))
      setCompanyPumps(companyPumps)
    }
  }, [keyword, pumps])

  return (
    <Container>
      <Row className='justify-content-md-center'>
        <h1
          style={{
            display: 'inline-block',
            marginTop: '-10px',
            marginLeft: '20px',
            marginRight: '40px',
          }}
        >
          الطلمبات
        </h1>
        <Col md={10}>
          <Row style={{ marginBottom: '20px', marginTop: '-10px' }}>
            <Col>
              <Button variant='outline-success' onClick={handleShow}>
                <FaPlus /> اضافة طلمبة
              </Button>
            </Col>
            <Col md={8} style={{ marginLeft: '10%' }}>
              <SearchBox search='ابحث باسم الطلمبة' searchComponent='pump' />
            </Col>
          </Row>
          <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>اضافة طلمبة</Modal.Title>
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
                    <Form.Group controlId='agent'>
                      <Form.Select
                        aria-label='Default select example'
                        value={agent}
                        onChange={(e) => setAgent(e.target.value)}
                      >
                        <option selected value=''>
                          اختر الوكيل
                        </option>
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
                  <Col md={1}></Col>
                  <Col md={5}>
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
                        placeholder='ادخل سعة المحطة'
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
                        placeholder='ادخل اسم المحطة'
                        autoFocus
                        value={pump}
                        onChange={(e) => setPump(e.target.value)}
                      ></Form.Control>
                    </Form.Group>
                  </Col>
                </Row>
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
            <>
              {keyword ? (
                <Table striped bordered hover responsive className='table-sm'>
                  <thead>
                    <tr>
                      <th>الرقم</th>
                      <th>الشركة</th>
                      <th>الوكيل</th>
                      <th>المحلية</th>
                      <th>الوحدة الادارية</th>
                      <th>نوع الوقود</th>
                      <th>سعة المحطة</th>
                      <th>الطلمبة</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {companyPumps.map((pump, index) => (
                      <tr key={pump._id}>
                        <td>
                          <strong>{index + 1}</strong>
                        </td>
                        <td>
                          <strong>{pump.company}</strong>
                        </td>
                        <td>
                          <strong>{pump.agent}</strong>
                        </td>
                        <td>
                          <strong>{pump.local}</strong>
                        </td>
                        <td>
                          <strong>{pump.unit}</strong>
                        </td>
                        <td>
                          <strong>{pump.pumpType}</strong>
                        </td>
                        <td>
                          <strong>{pump.capacity}</strong>
                        </td>
                        <td>
                          <strong>{pump.pump}</strong>
                        </td>
                        <td className='text-center'>
                          <LinkContainer
                            to={`/admin/pump/${pump._id}/edit/${page}`}
                            style={{ marginLeft: '10px' }}
                          >
                            <Button variant='light' className='btn-sm'>
                              <FaEdit />
                            </Button>
                          </LinkContainer>
                          <Button
                            variant='danger'
                            className='btn-sm'
                            onClick={() => deleteHandler(pump._id)}
                          >
                            <FaTrash style={{ color: 'white' }} />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <>
                  <Table striped bordered hover responsive className='table-sm'>
                    <thead>
                      <tr>
                        <th>الرقم</th>
                        <th>الشركة</th>
                        <th>الوكيل</th>
                        <th>المحلية</th>
                        <th>الوحدة الادارية</th>
                        <th>نوع الوقود</th>
                        <th>سعة المحطة</th>
                        <th>الطلمبة</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.pumps.map((pump, index) => (
                        <tr key={pump._id}>
                          <td>
                            <strong>{index + 1}</strong>
                          </td>
                          <td>
                            <strong>{pump.company}</strong>
                          </td>
                          <td>
                            <strong>{pump.agent}</strong>
                          </td>
                          <td>
                            <strong>{pump.local}</strong>
                          </td>
                          <td>
                            <strong>{pump.unit}</strong>
                          </td>
                          <td>
                            <strong>{pump.pumpType}</strong>
                          </td>
                          <td>
                            <strong>{pump.capacity}</strong>
                          </td>
                          <td>
                            <strong>{pump.pump}</strong>
                          </td>
                          <td className='text-center'>
                            <LinkContainer
                              to={`/admin/pump/${pump._id}/edit/${data.page}`}
                              style={{ marginLeft: '10px' }}
                            >
                              <Button variant='light' className='btn-sm'>
                                <FaEdit />
                              </Button>
                            </LinkContainer>
                            <Button
                              variant='danger'
                              className='btn-sm'
                              onClick={() => deleteHandler(pump._id)}
                            >
                              <FaTrash style={{ color: 'white' }} />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                  <Paginate
                    pages={data.pages}
                    page={data.page}
                    href='pumps'
                    isAdmin={true}
                  />
                </>
              )}
            </>
          )}
        </Col>
      </Row>
    </Container>
  )
}

export default PumpListScreen
