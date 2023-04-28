import { AutoRegPage } from './Autoreg/AutoRegPage'
import { useSelector } from 'react-redux'
import { StoreState } from '../../store/store'
import { useState, useEffect } from 'react'
import { IAppState } from '../../store/types'
import { AccountsManagerPage } from './AccountsManager/AccountsManagerPage'
import { LogsPage } from './Logs/LogsPage'
import { ProxyManagerPage } from './ProxyManager/ProxyManagerPage'
import { SettingsPage } from './Settings/SettingsPage'
import { WarmingUpPage } from './WarmingUp/WarmingUpPage'

/**
 * Routing system for application
 * Contains `Pages | Layout` for `App.tsx` `<Layout />` cpmponent
 * 
 * @description
 * Add more `Route` pages and connect Naviagtion with `<Sider />` component
 */
export const RouterPages = () => {
  const [page, setPage] = useState<IAppState["appPage"]>('1')
  const storedPage = useSelector((state: StoreState) => state.app.appPage)

  useEffect(() => {
    setPage(storedPage)
  }, [storedPage])

  return (
    <>
      {page === '1' && <AutoRegPage />}
      {page === '2' && <AccountsManagerPage />}
      {page === '3' && <ProxyManagerPage />}
      {page === '4' && <WarmingUpPage />}
      {page === '5' && <LogsPage />}
      {page === '6' && <SettingsPage />}
    </>
  )
}
