import { useState, useEffect } from 'react'
import {
  Button,
  Modal,
  Form,
  Table,
  Row,
  Col,
  Container,
} from 'react-bootstrap'
import Paginate from '../../components/Paginate'
import SearchBox from '../../components/SearchBox'
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa'
import { useNavigate, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { LinkContainer } from 'react-router-bootstrap'
import Loader from '../../components/Loader'
import Message from '../../components/Message'
import {
  useGetCompaniesForPaginationQuery,
  useAddCompanyMutation,
  useDeleteCompanyMutation,
} from '../../slices/companySlice'
import { toast } from 'react-toastify'

const CompanyListScreen = () => {
  const { page, keyword } = useParams()

  const [show, setShow] = useState(false)
  const [name, setName] = useState('')
  // const [error, setError] = useState('')

  const handleClose = () => {
    setShow(false)
    setName('')
  }
  const handleShow = () => setShow(true)

  const { userInfo } = useSelector((state) => state.auth)
  const navigate = useNavigate()

  const { data, refetch, isLoading } = useGetCompaniesForPaginationQuery({
    keyword,
    page,
  })
  const [addCompany, { isLoadind: loadingAdd }] = useAddCompanyMutation()
  const [deleteCompany, { isLoading: loadingDelete, error: errorDelete }] =
    useDeleteCompanyMutation()

  useEffect(() => {
    if (!userInfo) {
      navigate('/login')
    }
  }, [userInfo, navigate])

  const deleteHandler = async (id) => {
    if (window.confirm('Are you sure !')) {
      try {
        await deleteCompany(id)
        refetch()
        toast.success('Company deleted successfully')
      } catch (error) {
        toast.error(error?.data?.message || error.error)
      }
    }
  }

  const submitHandler = async (e) => {
    e.preventDefault()
    try {
      await addCompany({ name }).unwrap()
      handleClose()
      refetch()
      setName('')
    } catch (error) {
      toast.error(error?.data?.message || error.error)
    }
  }

  return (
    <Container>
      <Row className='justify-content-center'>
        <h1>الشركات</h1>
        <Col md={7}>
          <Row style={{ marginBottom: '20px', marginTop: '-10px' }}>
            <Col>
              <Button variant='outline-success' onClick={handleShow}>
                <FaPlus /> اضافة شركة
              </Button>
            </Col>
            <Col md={8} style={{ marginLeft: '10%' }}>
              <SearchBox search='ابحث باسم الشركة' searchComponent='company' />
            </Col>
          </Row>
          <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title> اضافة شركة</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Group controlId='company'>
                  <Form.Control
                    type='text'
                    placeholder='ادخل اسم الشركة'
                    autoFocus
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  ></Form.Control>
                </Form.Group>
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
          ) : (
            <>
              <Table
                className='table-sm mt-2'
                hover
                responsive
                bordered
                striped
              >
                <thead>
                  <tr>
                    <th>الرقم</th>
                    <th>الاسم</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {data.companies.map((company, index) => (
                    <tr key={company._id}>
                      <td>
                        <strong>{index + 1}</strong>
                      </td>
                      <td>
                        <strong>{company.name}</strong>
                      </td>
                      <td className='text-center'>
                        <LinkContainer
                          to={`/admin/company/${company._id}/edit/${data.page}`}
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
                          onClick={() => deleteHandler(company._id)}
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
                isAdmin={true}
                href='companies'
              />
            </>
          )}
        </Col>
      </Row>
    </Container>
  )
}

export default CompanyListScreen
