import { Routes, Route } from 'react-router-dom'

import { AutoRegPage } from './Pages/AutoRegPage'

/**
 * Routing system for application
 * Contains `Pages | Layout` for `App.tsx` `<Layout />` cpmponent
 * 
 * @description
 * Add more `Route` pages and connect Naviagtion with `<Sider />` component
 */
export const RouterPages = () => {
  return (
    <Routes>
      <Route path='/' element={<AutoRegPage />} />
    </Routes>
  )
}
