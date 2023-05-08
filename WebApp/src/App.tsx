import React, { useEffect, useRef } from 'react'
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
  setUserProxyFolders,
} from './store/userSlice'
import { setSmsServiciesData, setSmsServisies } from './store/appSlice';
import { IHeaderType } from './pages/ApplicationPages/AccountsManager/Collumns';
import { smsServicesTypes } from './store/types';
import { IAccountsData } from './pages/ApplicationPages/AccountsManager/ParseAccountsTable';
import { 
  generateRandomCountry, 
  generateRandomDate, 
  generateRandomName, 
  generateRandomNumber, 
  generateRandomPhoneNumber, 
  generateRandomResting, 
  generateRandomStatus, 
  generateRandomString 
} from './utils/generateTempData';
import axios from 'axios'
import { IProxyData } from './pages/ApplicationPages/ProxyManager/ParseAccountsTable';
import { IProxyHeaderType } from './pages/ApplicationPages/ProxyManager/Collumns';


interface ILocalStorageParced {
  id: string,
  mail: string,
  nick: string
}

const App: React.FC = () => {
  const dispatch = useDispatch()
  const isUserLogined = useSelector((state: IRootStoreState) => state.user.isUserLogined)
  const navigate = useNavigate()

  const setSmsServiciesFromDB = async (): Promise<void> => {
    try {
      const servicies = await axios.get(`${process.env.REACT_APP_SERVER_END_POINT}/telegram/get-service`)
      const smsServiciesArray: smsServicesTypes[] = servicies.data.map((service: string) => (
        {
          title: service,
        }
      ))
      dispatch(setSmsServisies(smsServiciesArray))

      if (servicies.data) {
        const smsServiciesData = await Promise.all(
          servicies.data.map(async (service: string) => {
            try {
              const countries = await axios.get(`${process.env.REACT_APP_SERVER_END_POINT}/telegram/get-country?service=${service}`)
              const priceAndPhones = await axios.get(`${process.env.REACT_APP_SERVER_END_POINT}/telegram/get-available-phones?service=${service}&countryId=${countries.data[0].id}`) || null
              const balance = await axios.get(`${process.env.REACT_APP_SERVER_END_POINT}/telegram/get-balance?service=${service}`)
              return { title: service, balance: balance.data, countries: countries.data, cost: priceAndPhones.data.telegram.cost, count: priceAndPhones.data.telegram.count }
            } catch(err) {
              return { title: service, balance: null, countries: null, cost: null, count: null }
            }
          })
        )
        dispatch(setSmsServiciesData(smsServiciesData))
      }

    } catch (error) {
      console.error(error)
    }
  }

  // Dummy accounts data (temp)
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

  // Dummy proxy data (temp)
  const ParseProxiesTable = () => {
    const accountsData = useRef<IProxyData[]>()
  
    useEffect(() => {
      const dummyAll = new Array(35).fill(0).map((_, index) => { return {
        key: index,
        ip: generateRandomString(14),
        port: generateRandomNumber(4),
        login: 'country-ms-session',
        pass: generateRandomString(10),
        type: 'http',
        delay: generateRandomNumber(2),
        status: generateRandomStatus()
      }})
      accountsData.current = [...dummyAll]
    }, [])
  
    return accountsData.current
  }
  const ProxiesManagerTableData: IProxyHeaderType[] = [
    {
      key: '1',
      folder: 'Proxy 1',
      dopTitle: 'Аккаунты для прогрева',
      count: 12,
      country: 'Финляндия',
      latestActivity: '22 апреля, 2023',
      proxies: [...ParseProxiesTable() || []]
    },
    {
      key: '2',
      folder: 'Proxy 2',
      dopTitle: 'Аккаунты для каналов',
      count: 24,
      country: 'Германия',
      latestActivity: '22 апреля, 2023',
      proxies: [...ParseProxiesTable() || []]
    },
    {
      key: '3',
      folder: 'Proxy 3',
      dopTitle: 'Аккаунты для переписок',
      count: 24,
      country: 'Тайланд',
      latestActivity: '22 апреля, 2023',
      proxies: [...ParseProxiesTable() || []]
    },
    {
      key: '4',
      folder: 'Proxy 4',
      dopTitle: 'Аккаунты для переписок',
      count: 24,
      country: 'Тайланд',
      latestActivity: '22 апреля, 2023',
      proxies: [...ParseProxiesTable() || []]
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

      dispatch(setUserManagerFolders(AccountsManagerTableData))
      dispatch(setUserProxyFolders(ProxiesManagerTableData))
      
      setSmsServiciesFromDB() // get and set sms service from DB
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


