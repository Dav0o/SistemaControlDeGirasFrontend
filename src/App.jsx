import './App.css'
import AuthProviders from './auth/AuthProviders'
import Routes from './components/Routes'


function App() {
  
  return (
    <AuthProviders>
      <Routes />
    </AuthProviders>
  
  )
}

export default App
