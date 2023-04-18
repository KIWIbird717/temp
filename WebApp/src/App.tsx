import React, { useEffect } from 'react'
import { Registration } from './pages/Registration';
import { Logining } from './pages/Logining';
import { Application } from './pages/Application';
import { Routes, Route, useNavigate } from 'react-router-dom'
import { IRootStoreState } from './store/types';
import { useSelector } from 'react-redux';

const App: React.FC = () => {
  const isUserLogined = useSelector((state: IRootStoreState) => state.user.isUserLogined)
  const navigate = useNavigate()

  // Check user logedin
  useEffect(() => {
    if (isUserLogined) {
      navigate("/app")
    } else {
      navigate("/")
    }
  }, [isUserLogined])
  
  return (
    <Routes>
      <Route path="/" element={<Registration />}/>
      <Route path="/login" element={<Logining />}/>
      <Route path="/app" element={<Application />}/>
    </Routes>
  )
}

export default App;


