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
export const getItem = (
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

