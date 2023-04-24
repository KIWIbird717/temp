import React, { useState} from 'react'
import { Menu, Modal } from 'antd'
import fullLogo from '../../images/fullLogo.svg'
import { getItem, IMenuItems } from "./getItem"
import {
  ContactsOutlined,
  UsergroupAddOutlined,
  MessageOutlined,
  SettingOutlined,
  LogoutOutlined,
  LockOutlined,
  ExclamationCircleFilled,
  CodeOutlined
} from '@ant-design/icons';
import { colors } from '../../global-style/style-colors.module';
import { useDispatch } from 'react-redux';
import { setAppPage } from '../../store/appSlice';
import { LogOut } from '../../hooks/LogOut';
import { IAppState } from '../../store/types';
import { resetPageData } from '../../utils/resetPageData';

const menuItemsStyle: React.CSSProperties = {
  height: '50px'
}

export const SiderComponent = () => {
  const { confirm } = Modal
  
  const dispatch = useDispatch()
  const [selectedKey, setSelectedKey] = useState<string>('1')
  const [hoveredKey, setHoveredKey] = useState(null)

  const handleMenuItemMouseEnter = (e: any) => {
    setHoveredKey(e.key);
  }

  const handleMenuItemMouseLeave = () => {
    setHoveredKey(null);
  }

  const setItem = (page: IAppState["appPage"]): void => {
    dispatch(setAppPage(page))
    resetPageData(dispatch)
    setSelectedKey(page)
  }

  const menuItems: IMenuItems[] = [
      getItem('Авторегистратор', '1', <ContactsOutlined />, null, null, () => setItem("1"), menuItemsStyle),
      getItem('Менеджер аккаунтов', '2', <UsergroupAddOutlined />, null, null, () => setItem("2"), menuItemsStyle),
      getItem('Менеджер прокси', '3', <LockOutlined />, null, null, () => setItem("3"), menuItemsStyle),
      getItem('Прогрев', '4', <MessageOutlined />, null, null, () => setItem("4"), menuItemsStyle),
      getItem('Логи', '5', <CodeOutlined />, null, null, () => setItem("5"), menuItemsStyle),
  
    getItem('', 'grp2', null, [
      getItem('Настройки', '6', <SettingOutlined />, null, null, () => setItem("6"), menuItemsStyle),
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
          backgroundColor: hoveredKey === '6' ? colors.dangerBg : colors.white,
          ...menuItemsStyle
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
      <div className='h-[100%] flex justify-center items-end gap-1 object-contain'>
        <img className='h-[40px]' src={fullLogo} alt='Logo'/>
      </div>
      <div style={{ height: 'calc(100vh - 120px)' }} className='flex flex-col justify-between'>
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
