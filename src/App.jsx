import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './pages/layout/Layout'
import Home from './pages/home/Home'
import Users from './pages/users/Users'
import 'bootstrap/dist/css/bootstrap.min.css';
import User from './pages/users/components/User'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Vehicles } from './pages/vehicles/Vehicles';

function App() {
  
  return (
    <BrowserRouter>
    <Routes>
       
      <Route path='/' element={<Layout/>}>
        <Route index element={<Home/>} />
        <Route path='/users' element={<Users/>} />
        <Route path='/users/:userId' element={<User/>}/>
        <Route path='/vehicles' element={<Vehicles/>}/>

        
      </Route>
    </Routes>
    
  </BrowserRouter>
  )
}

export default App
