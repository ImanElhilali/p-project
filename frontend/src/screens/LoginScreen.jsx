import { useState, useEffect } from 'react'
import FormContainer from '../components/FormContainer'
import { Form, Button, Row, Col } from 'react-bootstrap'
import { useLocation, useNavigate } from 'react-router-dom'
import { FaSignInAlt } from 'react-icons/fa'
import { useSelector, useDispatch } from 'react-redux'
import Loader from '../components/Loader'
import { setCradintials } from '../slices/authSlice'
import { toast } from 'react-toastify'
import { useLoginMutation } from '../slices/userApiSlice'

const LoginScreen = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { userInfo } = useSelector((state) => state.auth)
  const [login, { isLoading }] = useLoginMutation()

  const { search } = useLocation()
  const sp = new URLSearchParams(search)
  const redirect = sp.get('redirect') || '/'

  const submitHandler = async (e) => {
    e.preventDefault()

    try {
      const res = await login({ email, password }).unwrap()
      dispatch(setCradintials({ ...res }))
      navigate(redirect)
    } catch (error) {
      toast.error(error?.data?.message || error.error)
    }
  }

  useEffect(() => {
    if (userInfo) {
      navigate(redirect)
    }
  }, [userInfo, navigate, redirect])
  return (
    <FormContainer>
      <Row className='justify-content-center'>
        <Col md={9}>
          <h1 style={{ marginTop: '20px' }}>تسجيل الدخول</h1>
          <Form onSubmit={submitHandler}>
            <Form.Group className='my-2' controlId='email'>
              <Form.Label></Form.Label>
              <Form.Control
                type='email'
                placeholder='ادخل اسم المستخدم'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group className='my-2' controlId='password'>
              <Form.Label></Form.Label>
              <Form.Control
                type='password'
                placeholder='ادخل كلمة المرور'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              ></Form.Control>
            </Form.Group>
            <Button
              disabled={isLoading}
              type='submit'
              variant='success'
              className='my-3'
            >
              <FaSignInAlt /> تسجيل الدخول
            </Button>

            {isLoading && <Loader />}
          </Form>
        </Col>
      </Row>
    </FormContainer>
  )
}

export default LoginScreen
