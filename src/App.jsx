import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './pages/layout/Layout'
import Home from './pages/home/Home'

function App() {
  

  return (
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Layout/>}>
        <Route index element={<Home/>} />
        
        
      </Route>
    </Routes>
    
  </BrowserRouter>
  )
}

export default App
