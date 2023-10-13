import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './pages/layout/Layout'
import Home from './pages/home/Home'
import Users from './pages/users/Users'
import 'bootstrap/dist/css/bootstrap.min.css';
import User from './pages/users/components/User'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Vehicles } from './pages/vehicles/Vehicles';
import Login from './pages/auth/Login'
import Vehicle from './pages/vehicle/Vehicle'
import VehicleMaintenances from './pages/vehicle/components/VehicleMaintenances'
import RequestForm from './pages/requestForm/RequestForm'
import EndorseRequest from './pages/endorseRequest/EndorseRequest'
import ApproveRequest from './pages/approveRequest/ApproveRequest'
import CheckedRequests from './pages/checkedRequests/CheckedRequests'
import UserRole from './pages/users/components/UserRole'
import RequestDays from './pages/requestDays/RequestDays'
import RequestGasoline from './pages/requestGasoline/RequestGasoline'
import WorkingTime from './pages/workingTimeControl/WorkingTime'
import DriverLog from './pages/driverLog/DriverLog'






function App() {
  
  return (
    <BrowserRouter>
    <Routes>
    <Route index element={<Login/>} />
      <Route path='/' element={<Layout/>}>
        
        <Route path='/users' element={<Users/>} />
        {/* <Route path='/users/:userId' element={<User/>}/> */}
        <Route path='/users/UserRole/:User' element={<UserRole/>}/>
       
        <Route path='/vehicles' element={<Vehicles/>}/>
        <Route path='/home' element={<Home/>}/>
      
        <Route path='/vehicle' element={<Vehicle/>}/>
        <Route path='/vehicle/:vehicleId' element={<VehicleMaintenances/>}/>

        <Route path='/requestForm' element={<RequestForm/>}/>
        <Route path='/endorseRequest' element={<EndorseRequest/>}/>
        <Route path='/approveRequest' element={<ApproveRequest/>}/>

        <Route path='/checkedRequests' element={<CheckedRequests/>}/>
       
        <Route path='/workingTimeControl' element={<WorkingTime/>}/>
        <Route path="/driverLogs/:id" element={<DriverLog/>} />

       <Route path='/requestDays/:requestDaysId' element={<RequestDays/>}/>
       <Route path='/requestGasoline/:requestGasolineId' element={<RequestGasoline/>}/>
      </Route>
    </Routes>
    
  </BrowserRouter>
  )
}

export default App
