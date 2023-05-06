import React, { useEffect, useState, useRef } from 'react'
import { Registration } from './pages/Registration';
import { Logining } from './pages/Logining';
import { Application } from './pages/Application';
import { Routes, Route, useNavigate } from 'react-router-dom'
import { IRootStoreState } from './store/types';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { 
  setUserMail, 
  setUserIsLogined, 
  setUserId, 
  setUserNick, 
  setUserManagerFolders,
} from './store/userSlice'
import { setSmsServisies } from './store/appSlice';
import { IHeaderType } from './pages/ApplicationPages/AccountsManager/Collumns';
import { smsServicesTypes } from './store/types';
import { IAccountsData } from './pages/ApplicationPages/AccountsManager/ParseAccountsTable';
import { generateRandomCountry, generateRandomDate, generateRandomName, generateRandomPhoneNumber, generateRandomResting, generateRandomStatus, generateRandomString } from './utils/generateTempData';


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
  const ParseAccountsTable = () => {
    const accountsData = useRef<IAccountsData[]>()
  
    const dummyAll = new Array(35).fill(0).map((_, index) => { return {
      key: index,
      avatar: "https://xsgames.co/randomusers/avatar.php?g=pixel&key=2",
      phoneNumber: generateRandomPhoneNumber(),
      resting: generateRandomResting(),
      fullName: generateRandomName(),
      secondFacAith: generateRandomString(12),
      proxy: generateRandomCountry(),
      latestActivity: generateRandomDate(2023, 2023),
      status: generateRandomStatus(),
    }})
    accountsData.current = [...dummyAll]
  
    return accountsData.current
  }
  const AccountsManagerTableData: IHeaderType[] = [
    {
      key: '0',
      folder: 'Чаты',
      dopTitle: 'Аккаунты для чатов',
      accountsAmount: [...ParseAccountsTable()].length,
      country: 'Финляндия',
      latestActivity: '21 апреля',
      banned: 0,
      accounts: [...ParseAccountsTable()]
    },
    {
      key: '1',
      folder: 'Telegram',
      dopTitle: 'Аккаунты для каналов',
      accountsAmount: [...ParseAccountsTable()].length,
      country: 'Германия',
      latestActivity: '22 апреля',
      banned: 0,
      accounts: [...ParseAccountsTable()]
    },
    {
      key: '2',
      folder: 'Telegram каналы',
      dopTitle: 'Боты для телеграм каналов',
      accountsAmount: [...ParseAccountsTable()].length,
      country: 'Канада',
      latestActivity: '22 апреля',
      banned: 0,
      accounts: [...ParseAccountsTable()]
    },
    {
      key: '3',
      folder: 'Мои боты',
      dopTitle: 'Боты для меня',
      accountsAmount: [...ParseAccountsTable()].length,
      country: 'Канада',
      latestActivity: '22 апреля',
      banned: 0,
      accounts: [...ParseAccountsTable()]
    },
    {
      key: '4',
      folder: 'Для шеринга',
      dopTitle: 'Боты для шеринга',
      accountsAmount: [...ParseAccountsTable()].length,
      country: 'Канада',
      latestActivity: '22 апреля',
      banned: 0,
      accounts: [...ParseAccountsTable()]
    },
  ]

  const dummySmsServisies: smsServicesTypes[] = [
    {
      title: 'SMS-Activate API',
      type: 'service'
    },
    {
      title: 'SMS-Activator',
      type: 'service'
    },
    {
      title: 'SMS-Service',
      type: 'service'
    },
    {
      title: 'SMS-Phones',
      type: 'service'
    }
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
      dispatch(setUserManagerFolders(AccountsManagerTableData))
      dispatch(setSmsServisies(dummySmsServisies))
      navigate("/app")
      // From here could be added more user info 
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


