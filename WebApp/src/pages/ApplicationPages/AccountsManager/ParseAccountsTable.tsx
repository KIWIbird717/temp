import React, { useState, useEffect, useRef } from 'react'
import type { ColumnType } from 'antd/es/table';
import { 
  generateRandomPhoneNumber, 
  generateRandomResting,
  generateRandomName,
  generateRandomString,
  generateRandomCountry,
  generateRandomDate,
  generateRandomStatus
 } from './generateTempData';
import { Tag, InputRef, Space, Input, Button, Dropdown, message, Avatar } from 'antd';
import { CheckSquareOutlined, ClockCircleTwoTone, DeleteOutlined, EditOutlined, EnterOutlined, FieldTimeOutlined, MoreOutlined, SearchOutlined, UploadOutlined, UserOutlined } from '@ant-design/icons';
import type { FilterConfirmProps } from 'antd/es/table/interface';
import Highlighter from 'react-highlight-words';
import type { MenuProps } from 'antd';
import { colors } from '../../../global-style/style-colors.module';


export interface IAccountsData {
  key: React.Key,
  avatar: string,
  phoneNumber: string,
  resting: string,
  fullName: string,
  secondFacAith: string,
  proxy: string,
  latestActivity: string,
  status: string,
}

type DataIndex = keyof IAccountsData;

const GetColumnSearchProps = (data: DataIndex) => {
  const [searchText, setSearchText] = useState<string>('')
  const [searchedColumn, setSearchedColumn] = useState<string>('')
  const searchInput = useRef<InputRef>(null)

  const handleSearch = (
    selectedKeys: string[],
    confirm: (param?: FilterConfirmProps) => void,
    dataIndex: DataIndex,
  ) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  
  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchText('');
  };
  
  const getColumnSearchProps = (dataIndex: DataIndex): ColumnType<IAccountsData> => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder="Поиск по номеру"
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Поиск
          </Button>
          <Button
            onClick={() => {clearFilters && handleReset(clearFilters); handleSearch([''] as string[], confirm, dataIndex)}}
            size="small"
            style={{ width: 90 }}
          >
            Вернуть
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes((value as string).toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });

  return getColumnSearchProps(data)
}

export const TableHeaders = () => {
  
  const dropDownItems: MenuProps['items'] = [
    {
      key: '0',
      label: 'Редактировать',
      icon: <EditOutlined />
    },
    {
      key: '1',
      label: 'Переместить',
      icon: <div style={{ transform: 'rotate(180deg)' }}><EnterOutlined /></div>,
    },
    {
      key: '2',
      label: 'Экспорт"',
      icon: <UploadOutlined />,
    },
    {
      key: '3',
      label: 'Валидность',
      icon: <CheckSquareOutlined />,
    },
    {
      type: 'divider',
    },
    {
      key: '4',
      label: 'Удалить',
      icon: <DeleteOutlined />,
      danger: true,
    },
  ]
  
  const tableHeaders: any = [
    {
      title: 'Аватар',
      dataIndex: 'avatar',
      render: (tag: any) => (
        <span>
          {[tag].map((el: string) => (
            <Avatar icon={<UserOutlined />} />
          ))}
        </span>
      ),
    },
    {
      title: 'Номер',
      dataIndex: 'phoneNumber',
      editable: true,
      ...GetColumnSearchProps('phoneNumber')
    },
    {
      title: 'Отлёжка',
      dataIndex: 'resting',
      render: (resting: string) => (
        <div className="flex gap-2">
          {resting} 
          <ClockCircleTwoTone twoToneColor={colors.primary} />
        </div>
      )
    },
    {
      title: 'ФИО',
      dataIndex: 'fullName',
      editable: true,
      ...GetColumnSearchProps('fullName'),
    },
    {
      title: '2ФА',
      dataIndex: 'secondFacAith'
    },
    {
      title: 'Proxy',
      editable: true,
      dataIndex: 'proxy'
    },
    {
      title: 'Поседняя активность',
      dataIndex: 'latestActivity'
    },
    {
      title: 'Статус',
      dataIndex: 'status',
      render: (tags: any) => (
        <div className='flex items-center justify-between'>
          <div>
            {[tags].map((tag: string) => {
              let color: string = 'green'
              if (tag === 'active') {color = 'green'}
              if (tag === 'banned') {color = 'red'}
              if (tag === 'resting') {color = 'yellow'}
    
              return <Tag color={color} key={tag}>{tag}</Tag>
            })}
          </div>
          <Dropdown menu={{ items: dropDownItems, onClick }} trigger={['click']}>
            <Button style={{ borderWidth: '0px', boxShadow: 'inherit' }} shape="circle" icon={<MoreOutlined />} />
          </Dropdown>
        </div>
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
      onFilter: (value: any, record: any) => record.status.indexOf(value as string) === 0,
    }
  ]
  
  const onClick: MenuProps['onClick'] = ({ key }) => {
    message.info(`Click on item ${key}`)
  }
  
  return tableHeaders
}


export const ParseAccountsTable = () => {
  const [accountsData, setAccountsData] = useState<IAccountsData[]>([])

  useEffect(() => {
    const dummyAll = new Array(35).fill(0).map((_, index) => { return {
      key: index,
      avatar: 'e',
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
