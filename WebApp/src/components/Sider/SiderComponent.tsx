import React from 'react'
import { Menu } from 'antd'
import { menuItems } from './SliderMenuItems'
import logo from '../../images/logo.svg'

export const SiderComponent = () => {
  return (
    <div className='w-full grid gap-6 py-6'>
      <div className='h-[100] w-full flex justify-center'>
        <img src={logo} alt='Logo'/>
      </div>
      <Menu
        mode="inline"
        defaultSelectedKeys={['1']}
        style={{ borderRight: 0 }}
        items={ menuItems }
      />
    </div>
  )
}
