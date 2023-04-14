import React from 'react'
import {
  ContactsOutlined,
  InboxOutlined,
  UsergroupAddOutlined,
  MailOutlined,
  MessageOutlined,
  CarryOutOutlined,
  FieldTimeOutlined,
  SettingOutlined,
  WalletOutlined,
  BookOutlined,
  InfoCircleOutlined,
  LogoutOutlined,
  CommentOutlined
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
  getItem('Основные', 'grp', null, [
    getItem('Авторег', '1', <ContactsOutlined />, null, null, () => console.log('Clicked')), 
    getItem('Парсинг', '2', <InboxOutlined />, null, null, () => console.log('Clicked')),
    getItem('Инвайтинг', '3', <UsergroupAddOutlined />, null, null, () => console.log('Clicked')),
    getItem('Рассылка', '4', <MailOutlined />, null, null, () => console.log('Clicked')),
    getItem('Диалоги', '5', <CommentOutlined />, null, null, () => console.log('Clicked')),
    getItem('Чекер', '6', <CarryOutOutlined />, null, null, () => console.log('Clicked')),
    getItem('Сессии', '7', <FieldTimeOutlined />, null, null, () => console.log('Clicked')),
  ], 'group'),

  getItem('Дополнительно', 'grp', null, [
    getItem('Настройки', '8', <SettingOutlined />, null, null, () => console.log('Clicked')), 
    getItem('Оплата', '9', <WalletOutlined />, null, null, () => console.log('Clicked')),
    getItem('Инструкция', '10', <BookOutlined />, null, null, () => console.log('Clicked')),
    getItem('FAQ', '11', <InfoCircleOutlined />, null, null, () => console.log('Clicked')),
  ], 'group'),

  getItem('', 'grp', null, [
    getItem('Помощь', '12', <MessageOutlined />, null, null, () => console.log('Clicked')), 
    getItem('Выход', '13', <LogoutOutlined />, null, null, () => console.log('Clicked'), {color: colors.dopError}),
  ], 'group'),
]

