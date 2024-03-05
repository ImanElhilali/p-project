import { useState, useEffect } from 'react'
import {
  Table,
  Button,
  Row,
  Col,
  Modal,
  Form,
  Container,
} from 'react-bootstrap'
import { useParams } from 'react-router-dom'
import Paginate from '../../components/Paginate'
import SearchBox from '../../components/SearchBox'
import { LinkContainer } from 'react-router-bootstrap'
import { FaEdit, FaPlus, FaTrash } from 'react-icons/fa'
import Loader from '../../components/Loader'
import Message from '../../components/Message'
import { toast } from 'react-toastify'
import {
  useGetAgentsQuery,
  useGetAgentsForPaginationQuery,
  useAddAgentMutation,
  useDeleteAgentMutation,
} from '../../slices/agentSlice'
import { useGetCompaniesQuery } from '../../slices/companySlice'

const AgentListScreen = () => {
  const { page, keyword } = useParams()

  const [companiesData, setCompaniesData] = useState([])
  const [company, setCompany] = useState('')
  const [agent, setAgent] = useState('')
  const [companyAgents, setCompanyAgents] = useState([])

  const [show, setShow] = useState(false)
  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)

  const { data, refetch, isLoading, error } = useGetAgentsForPaginationQuery({
    keyword,
    page,
  })
  const { data: agents } = useGetAgentsQuery()
  const { data: companies } = useGetCompaniesQuery()
  const [addAgent, { isLoading: loadingAdd }] = useAddAgentMutation()
  const [deleteAgent] = useDeleteAgentMutation()

  const submitHandler = async (e) => {
    e.preventDefault()
    try {
      await addAgent({ company, agent }).unwrap()
      refetch()
      handleClose()
      setAgent('')
      setCompany('')
    } catch (error) {
      toast.error(error?.data?.message || error.error)
    }
  }
  const deleteHandler = async (id) => {
    if (window.confirm('هل انت متأكد !'))
      try {
        await deleteAgent(id).unwrap()
        toast.success('تم حذف العميل')
        refetch()
      } catch (error) {
        toast.error(error?.data?.message || error.error)
      }
  }

  useEffect(() => {
    if (companies) {
      setCompaniesData(companies)
    }
  }, [companies])

  useEffect(() => {
    if (keyword) {
      const companyAgent = agents.filter((agent) =>
        agent.company.includes(keyword)
      )
      setCompanyAgents(companyAgent)
    }
  }, [keyword, agents])

  return (
    <Container>
      <Row className='justify-content-md-center'>
        <h1> الوكلاء</h1>
        <Col md={7}>
          <Row style={{ marginBottom: '30px', marginTop: '-10px' }}>
            <Col>
              <Button variant='outline-success' onClick={handleShow}>
                <FaPlus /> إضافة وكيل
              </Button>
            </Col>
            <Col md={8} style={{ marginLeft: '10%' }}>
              <SearchBox search='ابحث باسم الشركة' searchComponent='agent' />
            </Col>
          </Row>
          <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>إضافة وكيل</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Row className='mb-2'>
                  <Col md={6}>
                    <Form.Group controlId='company'>
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
                  </Col>
                  <Col md={1}></Col>
                  <Col md={5}>
                    <Form.Group controlId='agent'>
                      <Form.Control
                        type='text'
                        placeholder='ادخل اسم الوكيل'
                        value={agent}
                        onChange={(e) => setAgent(e.target.value)}
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
          {isLoading ? (
            <Loader />
          ) : error ? (
            <Message variant='danger'>
              {error?.data?.message || error.error}
            </Message>
          ) : (
            <>
              {keyword ? (
                <>
                  <Table striped hover bordered responsive className='table-sm'>
                    <thead>
                      <tr>
                        <th>الرقم</th>
                        <th>الشركة</th>
                        <th>الوكيل</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {companyAgents.map((agent, index) => (
                        <tr key={agent._id}>
                          <td>
                            <strong>{index + 1}</strong>
                          </td>
                          <td>
                            <strong>{agent.company}</strong>
                          </td>
                          <td>
                            <strong>{agent.agent}</strong>
                          </td>
                          <td className='text-center'>
                            <LinkContainer
                              to={`/admin/agent/${agent._id}/edit`}
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
                              onClick={() => deleteHandler(agent._id)}
                            >
                              <FaTrash />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </>
              ) : (
                <>
                  <Table striped hover bordered responsive className='table-sm'>
                    <thead>
                      <tr>
                        <th>الرقم</th>
                        <th>الشركة</th>
                        <th>الوكيل</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.agents.map((agent, index) => (
                        <tr key={agent._id}>
                          <td>
                            <strong>{index + 1}</strong>
                          </td>
                          <td>
                            <strong>{agent.company}</strong>
                          </td>
                          <td>
                            <strong>{agent.agent}</strong>
                          </td>
                          <td className='text-center'>
                            <LinkContainer
                              to={`/admin/agent/${agent._id}/edit/${data.page}`}
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
                              onClick={() => deleteHandler(agent._id)}
                            >
                              <FaTrash />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                  <Paginate
                    pages={data.pages}
                    page={data.page}
                    href='agents'
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

export default AgentListScreen
