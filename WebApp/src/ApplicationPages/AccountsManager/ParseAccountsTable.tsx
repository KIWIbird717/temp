import React, { useState, useEffect } from 'react'
import type { ColumnsType } from 'antd/es/table';
import { 
  generateRandomPhoneNumber, 
  generateRandomResting,
  generateRandomName,
  generateRandomString,
  generateRandomCountry,
  generateRandomDate,
  generateRandomStatus
 } from './generateTempData';
import { Tag } from 'antd';

export interface IAccountsData {
  key: React.Key,
  phoneNumber: string,
  resting: string,
  fullName: string,
  secondFacAith: string,
  proxy: string,
  latestActivity: string,
  status: string,
}

export const tableHeaders: ColumnsType<IAccountsData> = [
  {
    title: 'Номер',
    dataIndex: 'phoneNumber'
  },
  {
    title: 'Отлёжка',
    dataIndex: 'resting'
  },
  {
    title: 'ФИО',
    dataIndex: 'fullName'
  },
  {
    title: '2ФА',
    dataIndex: 'secondFacAith'
  },
  {
    title: 'Proxy',
    dataIndex: 'proxy'
  },
  {
    title: 'Поседняя активность',
    dataIndex: 'latestActivity'
  },
  {
    title: 'Статус',
    dataIndex: 'status',
    render: (tags) => (
      <span>
        {[tags].map((tag: string) => {
          let color: string = 'green'
          if (tag === 'active') {color = 'green'}
          if (tag === 'banned') {color = 'red'}
          if (tag === 'resting') {color = 'yellow'}

          return <Tag color={color} key={tag}>{tag}</Tag>
        })}
      </span>
    ),
    filters: [
      {
        text: 'active',
        value: 'active'
      },
      {
        text: 'banned',
        value: 'banned'
      },
      {
        text: 'resting',
        value: 'resting'
      }
    ],
    onFilter: (value, record) => record.status.indexOf(value as string) === 0,
  },
  {
    title: 'Действия',
    dataIndex: 'actions',
    // render: () => (

    // )
  }
]

export const ParseAccountsTable = () => {
  const [accountsData, setAccountsData] = useState<IAccountsData[]>([])

  useEffect(() => {
    const dummyAll = new Array(35).fill(0).map((_, index) => { return {
      key: index,
      phoneNumber: generateRandomPhoneNumber(),
      resting: generateRandomResting(),
      fullName: generateRandomName(),
      secondFacAith: generateRandomString(12),
      proxy: generateRandomCountry(),
      latestActivity: generateRandomDate(2023, 2023),
      status: generateRandomStatus(),
    }})
    setAccountsData([...dummyAll])
  }, [])

  return accountsData
}

