import React, { useEffect } from 'react'
import { Registration } from './pages/Registration';
import { Logining } from './pages/Logining';
import { Application } from './pages/Application';
import { Routes, Route, useNavigate } from 'react-router-dom'
import { IRootStoreState } from './store/types';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { setUserMail, setUserIsLogined, setUserId, setUserNick, setUserManagerFolders } from './store/userSlice'
import { IHeaderType } from './pages/ApplicationPages/AccountsManager/Collumns';


interface ILocalStorageParced {
  id: string,
  mail: string,
  nick: string
}

const App: React.FC = () => {
  const dispatch = useDispatch()
  const isUserLogined = useSelector((state: IRootStoreState) => state.user.isUserLogined)
  const navigate = useNavigate()

  // Dummy data (temp)
  const tableData: IHeaderType[] = [
    {
      key: '1',
      folder: 'Чаты',
      dopTitle: 'Аккаунты для чатов',
      accounts: 12,
      country: 'Финляндия',
      latestActivity: '21 апреля',
      banned: 0,
    },
    {
      key: '2',
      folder: 'Telegram',
      dopTitle: 'Аккаунты для каналов',
      accounts: 24,
      country: 'Германия',
      latestActivity: '22 апреля',
      banned: 0
    },
    {
      key: '3',
      folder: 'Telegram каналы',
      dopTitle: 'Боты для телеграм каналов',
      accounts: 24,
      country: 'Канада',
      latestActivity: '22 апреля',
      banned: 0
    },
    {
      key: '4',
      folder: 'Мои боты',
      dopTitle: 'Боты для меня',
      accounts: 24,
      country: 'Канада',
      latestActivity: '22 апреля',
      banned: 0
    },
    {
      key: '5',
      folder: 'Для шеринга',
      dopTitle: 'Боты для шеринга',
      accounts: 24,
      country: 'Канада',
      latestActivity: '22 апреля',
      banned: 0
    },
  ]

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
      // From here could be added more user info 
      dispatch(setUserManagerFolders(tableData))
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


