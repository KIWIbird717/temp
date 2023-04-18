import React from 'react'
import { Menu } from 'antd'
import logo from '../../images/logo.svg'
import { getItem, IMenuItems } from "./getItem"
import {
  ContactsOutlined,
  UsergroupAddOutlined,
  MessageOutlined,
  SettingOutlined,
  LogoutOutlined,
  LockOutlined
} from '@ant-design/icons';
import { colors } from '../../global-style/style-colors.module';
import { useDispatch } from 'react-redux';
import { setUserIsLogined } from '../../store/userSlice';


export const SiderComponent = () => {
  const dispatch = useDispatch()

  const menuItems: IMenuItems[] = [
    getItem('', 'grp1', null, [
      getItem('Авторегистратор', '1', <ContactsOutlined />, null, null, () => console.log('Clicked')), 
      getItem('Менеджер аккаунтов', '2', <UsergroupAddOutlined />, null, null, () => console.log('Clicked')),
      getItem('Менеджер прокси', '3', <LockOutlined />, null, null, () => console.log('Clicked')),
      getItem('Прогрев', '4', <MessageOutlined />, null, null, () => console.log('Clicked')),
    ], 'group'),
  
    getItem('', 'grp2', null, [
      getItem('Настройки', '8', <SettingOutlined />, null, null, () => console.log('Clicked')), 
    ], 'group'),
  
    getItem('', 'grp3', null, [ 
      getItem('Выход', '13', <LogoutOutlined />, null, null, () => dispatch(setUserIsLogined(false)), {color: colors.dopError}),
    ], 'group'),
  ]

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
