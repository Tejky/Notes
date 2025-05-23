import './App.css'
import { Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import BoardPage from './pages/BoardPage'

function App() {

  return (
    <Routes>
      <Route path="/login" element={<LoginPage/>} />
      <Route path="/board" element={<BoardPage/>}/>
      <Route path="*" element={<HandleNavigate/>} />
    </Routes>
  )
}

export default App


const HandleNavigate = () => {
  const email = localStorage.getItem('email')
  return <Navigate to={email ? '/board' : '/login'} replace/>
}
