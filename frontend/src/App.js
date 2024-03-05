import Header from './components/Header'
import Footer from './components/Footer'
import { Outlet } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

function App() {
  return (
    <div style={{ fontFamily: 'Cairo', fontWeight: '600' }}>
      <ToastContainer />
      <Header />
      <main className='py-3'>
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default App
