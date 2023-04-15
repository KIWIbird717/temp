import React from 'react'
import {
  ContactsOutlined,
  UsergroupAddOutlined,
  MessageOutlined,
  SettingOutlined,
  LogoutOutlined,
  LockOutlined
} from '@ant-design/icons';
import { MenuProps } from 'antd';
import { colors } from '../../global-style/style-colors.module';


type MenuItem = Required<MenuProps>['items'][number];

export interface IMenuItems {
  label: string,
  key: React.Key,
  icon?: React.ReactElement,
  children?: MenuItem[],
  type?: 'group',
  onClick?: () => void,
  style?: React.CSSProperties
}

/**
 * 
 * @param label string
 * @param key React.Key
 * @param icon React.ReactElement | null
 * @param children MenuItem[]
 * @param type 'group'
 * @param onClick () => void
 * @param style React.CSSProperties
 * @returns MenuItem
 */
const getItem = (
  label: string,
  key: React.Key,
  icon?: React.ReactElement | null,
  children?: MenuItem[] | null,
  type?: 'group' | null,
  onClick?: () => void,
  style?: React.CSSProperties
): IMenuItems => {
  return {key, icon, children, onClick, style, label, type} as IMenuItems
}

export const menuItems: IMenuItems[] = [
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
    getItem('Выход', '13', <LogoutOutlined />, null, null, () => console.log('Clicked'), {color: colors.dopError}),
  ], 'group'),
]

