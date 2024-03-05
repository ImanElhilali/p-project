import { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { Form, Button, Container } from 'react-bootstrap'
import FormContainer from '../../components/FormContainer'
import { useGetUserDetailsQuery } from '../../slices/userApiSlice'
import { useUpdateUserMutation } from '../../slices/userApiSlice'
import Loader from '../../components/Loader'
import Message from '../../components/Message'
import { toast } from 'react-toastify'

const UserEditScreen = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [isAdmin, setIsAdmin] = useState(false)

  const { id } = useParams()
  const navigate = useNavigate()
  const { data: user, refetch, isLoading, error } = useGetUserDetailsQuery(id)
  const [updateUser, { isLoading: loadingUpdate }] = useUpdateUserMutation()

  useEffect(() => {
    if (user) {
      setName(user.name)
      setEmail(user.email)
      setIsAdmin(user.isAdmin)
    }
  }, [user])

  const submitHandler = async (e) => {
    e.preventDefault()
    try {
      await updateUser({ _id: id, name, email, isAdmin })
      toast.success('User updated successfully')
      refetch()
      navigate('/admin/userlist')
    } catch (error) {
      toast.error(error?.data?.message || error.error)
    }
  }
  return (
    <Container>
      <Link
        to='/admin/userlist'
        className='btn btn-light my-2'
        style={{ float: 'left' }}
      >
        تراجع
      </Link>
      <FormContainer>
        <h1 style={{ marginTop: '30px' }}>تعديل بيانات المستخدم</h1>
        {loadingUpdate && <Loader />}
        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant='danger'>
            {error?.data?.message || error.error}
          </Message>
        ) : (
          <Form onSubmit={submitHandler}>
            <Form.Group className='my-2' controlId='name'>
              <Form.Label>الاسم</Form.Label>
              <Form.Control
                type='text'
                value={name}
                onChange={(e) => setName(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group className='my-2' controlId='email'>
              <Form.Label>البريد الالكتروني</Form.Label>
              <Form.Control
                type='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group className='my-2' controlId='isadmin'>
              <Form.Check
                type='checkbox'
                label='Is Admin'
                checked={isAdmin}
                onChange={(e) => setIsAdmin(e.target.checked)}
              ></Form.Check>
            </Form.Group>

            <Button type='submit' variant='success'>
              تعديل
            </Button>
          </Form>
        )}
      </FormContainer>
    </Container>
  )
}

export default UserEditScreen
