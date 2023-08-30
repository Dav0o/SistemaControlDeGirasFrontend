import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './pages/layout/Layout'
import Home from './pages/home/Home'
<<<<<<< Updated upstream
import Users from './pages/users/Users'
import 'bootstrap/dist/css/bootstrap.min.css';

=======
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import { Vehicles } from './pages/vehicles/Vehicles';
>>>>>>> Stashed changes
function App() {
  
  return (
    <BrowserRouter>
    <Routes>
       
      <Route path='/' element={<Layout/>}>
        <Route index element={<Home/>} />
<<<<<<< Updated upstream
        <Route path='/users' element={<Users/>} />
        
=======
        <Route path='/vehicles' element={<Vehicles/>}/>
>>>>>>> Stashed changes
        
      </Route>
    </Routes>
    
  </BrowserRouter>
  )
}

export default App
