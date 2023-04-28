import React, { useEffect } from 'react'
import { Registration } from './pages/Registration';
import { Logining } from './pages/Logining';
import { Application } from './pages/Application';
import { Routes, Route, useNavigate } from 'react-router-dom'
import { IRootStoreState } from './store/types';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { setUserMail, setUserIsLogined, setUserId, setUserNick } from './store/userSlice'


interface ILocalStorageParced {
  id: string,
  mail: string,
  nick: string
}

const App: React.FC = () => {
  const dispatch = useDispatch()
  const isUserLogined = useSelector((state: IRootStoreState) => state.user.isUserLogined)
  const navigate = useNavigate()

  // Chek if user logedin and stay user logedin after page reload
  useEffect(() => {
    const token = localStorage.getItem('sessionToken')  // contains user email
    if (token) {
      // Parce data from localStorage
      const tokenData: ILocalStorageParced = JSON.parse(token)
      dispatch(setUserMail(tokenData.mail))
      dispatch(setUserId(Number(tokenData.id)))
      dispatch(setUserNick(tokenData.nick))
      dispatch(setUserIsLogined(true))
      navigate("/app")
    } else {
      navigate("/")
    }
  }, [isUserLogined])
  
  return (
    <Routes>
      <Route path="/registration" element={<Registration />}/>
      <Route path="/" element={<Logining />}/>
      <Route path="/app" element={<Application />}/>
    </Routes>
  )
}

export default App;


