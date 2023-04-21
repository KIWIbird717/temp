import React, { useState} from 'react'
import { Menu, Modal } from 'antd'
import logo from '../../images/logo.svg'
import { getItem, IMenuItems } from "./getItem"
import {
  ContactsOutlined,
  UsergroupAddOutlined,
  MessageOutlined,
  SettingOutlined,
  LogoutOutlined,
  LockOutlined,
  ExclamationCircleFilled
} from '@ant-design/icons';
import { colors } from '../../global-style/style-colors.module';
import { useDispatch } from 'react-redux';
import { LogOut } from '../../hooks/LogOut';


export const SiderComponent = () => {
  const { confirm } = Modal;
  
  const dispatch = useDispatch()
  const [selectedKey, setSelectedKey] = useState<string>('1')
  const [hoveredKey, setHoveredKey] = useState(null)

  const handleMenuItemMouseEnter = (e: any) => {
    setHoveredKey(e.key);
  }

  const handleMenuItemMouseLeave = () => {
    setHoveredKey(null);
  }

  const menuItems: IMenuItems[] = [
    getItem('', 'grp1', null, [
      getItem('Авторегистратор', '1', <ContactsOutlined />, null, null, () => setSelectedKey('1')), 
      getItem('Менеджер аккаунтов', '2', <UsergroupAddOutlined />, null, null, () => setSelectedKey('2')),
      getItem('Менеджер прокси', '3', <LockOutlined />, null, null, () => setSelectedKey('3')),
      getItem('Прогрев', '4', <MessageOutlined />, null, null, () => setSelectedKey('4')),
    ], 'group'),
  
    getItem('', 'grp2', null, [
      getItem('Настройки', '5', <SettingOutlined />, null, null, () => setSelectedKey('5')), 
    ], 'group')
  ]

  const logOutItem: IMenuItems[] = [
    getItem('', 'grp3', null, [ 
      getItem(
        'Выход', 
        '6', 
        <LogoutOutlined />, 
        null, 
        null, 
        () => showDeleteConfirm(),
        {
          marginTop: 'fillAvaliable',
          color: colors.danger, 
          backgroundColor: hoveredKey === '6' ? colors.dangerBg : colors.white
        }, 
        handleMenuItemMouseEnter, 
        handleMenuItemMouseLeave
      ),
    ], 'group'),
  ]

  const showDeleteConfirm = () => {
    confirm({
      title: 'Выход',
      icon: <ExclamationCircleFilled />,
      centered: true,
      content: 'Вы уверены, что хотите выйти?',
      okText: 'Выйти',
      okType: 'danger',
      cancelText: 'Отмена',
      onOk() {
        LogOut(dispatch)
      }
    })
  }

  return (
    <div className='w-full grid gap-6 py-6'>
      <div className='h-[100px] flex justify-center'>
        <img src={logo} alt='Logo'/>
      </div>
      <div style={{ height: 'calc(100vh - 180px)' }} className='flex flex-col justify-between'>
        <Menu
          mode="inline"
          theme='light'
          defaultSelectedKeys={['1']}
          selectedKeys={[selectedKey]}
          style={{ borderRight: 0 }}
          items={ menuItems } 
        />
        <Menu 
          mode="inline"
          items={ logOutItem }
          style={{ borderRight: 0 }}
        />
      </div>
    </div>
  )
}
