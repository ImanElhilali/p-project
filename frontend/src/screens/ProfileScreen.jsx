import { useState } from 'react'
import FormContainer from '../components/FormContainer'
import { useNavigate } from 'react-router-dom'
import { Form, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import Loader from '../components/Loader'
import { setCradintials } from '../slices/authSlice'
import { useProfileMutation } from '../slices/userApiSlice'
import { useLogoutMutation } from '../slices/userApiSlice'
import { logout } from '../slices/authSlice'

const ProfileScreen = () => {
  const navigate = useNavigate()

  const [logoutApiCall] = useLogoutMutation()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const { userInfo } = useSelector((state) => state.auth)

  const dispatch = useDispatch()
  const [updateProfile, { isLoading }] = useProfileMutation()

  const submitHandler = async (e) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      toast.error('Passwords do not match')
    } else {
      try {
        const res = await updateProfile({
          _id: userInfo._id,
          password,
        }).unwrap()
        dispatch(setCradintials({ ...res }))
        await logoutApiCall().unwrap()
        dispatch(logout())
        navigate('/login')
      } catch (error) {
        console.error(error)
        toast.error(error?.data?.message || error.error)
      }
    }
  }
  return (
    <FormContainer>
      <h1 className='my-3'>تغيير كلمة المرور</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group className='my-4' controlId='password'>
          <Form.Control
            type='password'
            placeholder='ادخل كلمة المرور الجديدة'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group className='my-4' controlId='confirmPassword'>
          <Form.Control
            type='password'
            placeholder='ادخل كلمة المرور الجديدة مرة اخرى'
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Button type='submit' variant='success' disabled={isLoading}>
          تعديل
        </Button>
        {isLoading && <Loader />}
      </Form>
    </FormContainer>
  )
}

export default ProfileScreen
