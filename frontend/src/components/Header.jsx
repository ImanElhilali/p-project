import { Nav, Navbar, NavDropdown, Container } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { LinkContainer } from 'react-router-bootstrap'
import { useSelector, useDispatch } from 'react-redux'
import { useLogoutMutation } from '../slices/userApiSlice'
import { logout } from '../slices/authSlice'
import logo from '../assets/logo.png'
import '@fontsource/cairo'

const Header = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [logoutApiCall] = useLogoutMutation()

  const { userInfo } = useSelector((state) => state.auth)

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap()
      dispatch(logout())
      navigate('/login')
    } catch (error) {
      console.error(error)
    }
  }
  return (
    <header>
      <Navbar
        bg='success'
        variant='dark'
        expand='lg'
        collapseOnSelect
        style={{ fontWeight: '500' }}
      >
        <Container>
          <LinkContainer to='/'>
            <Navbar.Brand>
              <img src={logo} alt='PetrolApp' />
              نظام المواد البترولية
            </Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle aria-controls='basic-navbar-nav' />
          <Navbar.Collapse id='basic-navbar-nav'>
            <Nav className='me-auto'>
              {!userInfo && (
                <>
                  <LinkContainer to='/login'>
                    <Nav.Link>تسجيل الدخول</Nav.Link>
                  </LinkContainer>
                </>
              )}

              {userInfo && userInfo.isAdmin === false && (
                <>
                  <LinkContainer to='/transactions/page/1'>
                    <Nav.Link>المعاملات</Nav.Link>
                  </LinkContainer>
                  <LinkContainer to='/reports'>
                    <Nav.Link>التقارير</Nav.Link>
                  </LinkContainer>
                </>
              )}

              {/* Admin Links */}
              {userInfo && userInfo.isAdmin && (
                <NavDropdown title='الاعدادات' id='adminmenu'>
                  <LinkContainer to='/admin/repositorylist'>
                    <NavDropdown.Item>
                      <strong>المستودعات</strong>
                    </NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to='/admin/companylist/page/1'>
                    <NavDropdown.Item>
                      <strong>الشركات</strong>
                    </NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to='/admin/locallist'>
                    <NavDropdown.Item>
                      <strong>المحليات</strong>
                    </NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to='/admin/agentlist/page/1'>
                    <NavDropdown.Item>
                      <strong>الوكلاء</strong>
                    </NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to='/admin/userlist'>
                    <NavDropdown.Item>
                      <strong>المستخدمين</strong>
                    </NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to='/admin/pumplist/page/1'>
                    <NavDropdown.Item>
                      <strong>الطلمبات</strong>
                    </NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to='/admin/pumpTyplist'>
                    <NavDropdown.Item>
                      <strong>نوع الوقود</strong>
                    </NavDropdown.Item>
                  </LinkContainer>
                </NavDropdown>
              )}
              {userInfo && (
                <NavDropdown title={userInfo.name} id='username'>
                  <LinkContainer to='/profile'>
                    <NavDropdown.Item>تغيير كلمة المرور</NavDropdown.Item>
                  </LinkContainer>
                  <NavDropdown.Item onClick={logoutHandler}>
                    خروج
                  </NavDropdown.Item>
                </NavDropdown>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  )
}

export default Header
