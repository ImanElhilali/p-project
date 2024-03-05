import React from 'react'
import ReactDOM from 'react-dom/client'
import './assets/index.css'
import './assets/bootstrap.custom.css'
import '@fontsource/cairo'
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom'
import store from './store'
import { Provider } from 'react-redux'
import App from './App'
import RegisterScreen from './screens/RegisterScreen'
import LoginScreen from './screens/LoginScreen'
import ProfileScreen from './screens/ProfileScreen'
import UserListScreen from './screens/admin/UserListScreen'
import UserEditScreen from './screens/admin/UserEditScreen'
import CompanyListScreen from './screens/admin/CompanyListScreen'
import CompanyEditScreen from './screens/admin/CompanyEditScreen'
import LocalListScreen from './screens/admin/LocalListScreen'
import LocalEditScreen from './screens/admin/LocalEditScreen'
import UnitListScreen from './screens/admin/UnitListScreen'
import UnitEditScreen from './screens/admin/UnitEditScreen'
import AgentListScreen from './screens/admin/AgentListScreen'
import AgentEditScreen from './screens/admin/AgentEditScreen'
import PumpListScreen from './screens/admin/PumpListScreen'
import PumpEditScreen from './screens/admin/PumpEditScreen'
import PumpTypeListScreen from './screens/admin/PumpTypeListScreen'
import PumpTypeEditScreen from './screens/admin/PumpTypeEditScreen'
import RepsitoryListScreen from './screens/admin/RepsitoryListScreen'
import RepositoryEditScreen from './screens/admin/RepositoryEditScreen'
import TransactionListScreen from './screens/TransactionListScreen'
import TransactionEditScreen from './screens/TransactionEditScreen'
import HomeScreen from './screens/HomeScreen'
import ReportsScreen from './screens/ReportsScreen'
import AdminRoute from './components/AdminRoute'
import PrivateRoute from './components/PrivateRoute'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App />}>
      <Route path='/' element={<HomeScreen />} />
      <Route path='/login' element={<LoginScreen />} />
      <Route path='/profile' element={<ProfileScreen />} />

      <Route path='' element={<PrivateRoute />}>
        <Route
          path='/transactions/page/:page'
          element={<TransactionListScreen />}
        />
        <Route
          path='/transaction/:id/edit/:page'
          element={<TransactionEditScreen />}
        />
        <Route path='/reports' element={<ReportsScreen />} />
        <Route path='/reports/:keyword/:page' element={<ReportsScreen />} />
        <Route
          path='/transactions/page/:page/search/:keyword'
          element={<TransactionListScreen />}
        />
      </Route>

      <Route path='' element={<AdminRoute />}>
        <Route
          path='/admin/companylist/search/:keyword/page/:page'
          element={<CompanyListScreen />}
        />
        <Route
          path='/admin/pumplist/page/:page/search/:keyword'
          element={<PumpListScreen />}
        />
        <Route
          path='/admin/agentlist/page/:page/search/:keyword'
          element={<AgentListScreen />}
        />
        <Route
          path='/admin/companylist/page/:page'
          element={<CompanyListScreen />}
        />
        <Route
          path='/admin/agentlist/page/:page'
          element={<AgentListScreen />}
        />
        <Route path='/admin/pumplist/page/:page' element={<PumpListScreen />} />

        <Route path='/register' element={<RegisterScreen />} />
        <Route path='/admin/userlist' element={<UserListScreen />} />
        <Route path='/admin/userlist/:id/edit' element={<UserEditScreen />} />
        <Route path='/admin/repositorylist' element={<RepsitoryListScreen />} />
        <Route
          path='/admin/company/:id/edit/:page'
          element={<CompanyEditScreen />}
        />
        <Route path='/admin/locallist' element={<LocalListScreen />} />
        <Route path='/admin/local/:id/unitlist' element={<UnitListScreen />} />
        <Route path='/admin/localedit/:id/edit' element={<LocalEditScreen />} />
        <Route path='/admin/pump/:id/edit/:page' element={<PumpEditScreen />} />
        <Route
          path='/admin/local/:id/unitedit/:unitID/edit'
          element={<UnitEditScreen />}
        />
        <Route
          path='/admin/agent/:id/edit/:page'
          element={<AgentEditScreen />}
        />
        <Route path='/admin/pumpTyplist' element={<PumpTypeListScreen />} />
        <Route
          path='/admin/pumpType/:id/edit'
          element={<PumpTypeEditScreen />}
        />
        <Route path='/admin/repositorylist' element={<RepsitoryListScreen />} />
        <Route
          path='/admin/repository/:id/edit'
          element={<RepositoryEditScreen />}
        />
      </Route>
    </Route>
  )
)

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
)
