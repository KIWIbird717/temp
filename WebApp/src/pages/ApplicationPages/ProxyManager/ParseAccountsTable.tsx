import React, { useState, useEffect, useRef } from 'react'
import type { ColumnType } from 'antd/es/table';
import { 
  generateRandomString,
  generateRandomStatus,
  generateRandomNumber
 } from '../../../utils/generateTempData';
import { Tag, InputRef, Space, Input, Button, Dropdown, message, Avatar } from 'antd';
import { CheckSquareOutlined, ClockCircleTwoTone, DeleteOutlined, EditOutlined, EnterOutlined, FieldTimeOutlined, HddTwoTone, MoreOutlined, SearchOutlined, UploadOutlined, UserOutlined } from '@ant-design/icons';
import type { FilterConfirmProps } from 'antd/es/table/interface';
import Highlighter from 'react-highlight-words';
import type { MenuProps } from 'antd';
import { colors } from '../../../global-style/style-colors.module';


export interface IProxyData {
  key: React.Key,
  ip: string,
  port: string,
  login: string,
  pass: string,
  type: string,
  delay: string,
  status: string
}

type DataIndex = keyof IProxyData;

const GetColumnSearchProps = ({data, placeholder}: {data: DataIndex, placeholder: string}) => {
  const [searchText, setSearchText] = useState<string>('')
  const [searchedColumn, setSearchedColumn] = useState<string>('')
  const searchInput = useRef<InputRef>(null)

  const handleSearch = (
    selectedKeys: string[],
    confirm: (param?: FilterConfirmProps) => void,
    dataIndex: DataIndex,
  ) => {
    confirm()
    setSearchText(selectedKeys[0])
    setSearchedColumn(dataIndex)
  };
  
  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchText('');
  };
  
  const getColumnSearchProps = ({dataIndex, placeholderProp}: {dataIndex: DataIndex, placeholderProp: string}): ColumnType<IProxyData> => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={placeholderProp}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            onClick={() => {clearFilters && handleReset(clearFilters); handleSearch([''] as string[], confirm, dataIndex)}}
            size="small"
            style={{ width: 90 }}
          >
            Вернуть
          </Button>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Поиск
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

  return getColumnSearchProps({dataIndex: data, placeholderProp: placeholder})
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
      title: 'IP',
      dataIndex: 'ip',
    },
    {
      title: 'Порт',
      dataIndex: 'port',
      render: (resting: string) => (
        <div className="flex gap-2">
          {resting} 
          <HddTwoTone twoToneColor={colors.primary} />
        </div>
      ),
      ...GetColumnSearchProps({data: 'port', placeholder: 'Поиск по порту'})
    },
    {
      title: 'Логин',
      dataIndex: 'login',
      editable: true,
    },
    {
      title: 'Парлоь',
      dataIndex: 'pass'
    },
    {
      title: 'Тип',
      editable: true,
      dataIndex: 'type',
      filters: [
        {
          text: 'http',
          value: 'http'
        },
        {
          text: 'https',
          value: 'https'
        }
      ],
      onFilter: (value: string, record: any) => record.type.indexOf(value) === 0
    },
    {
      title: 'Задержка',
      dataIndex: 'delay',
      render: (delays: string) => (
        <div className="flex gap-2">
          {delays} 
          <ClockCircleTwoTone twoToneColor={colors.primary} />
        </div>
      )
    },
    {
      title: 'Статус',
      dataIndex: 'status',
      render: (tags: any) => (
        <div className='flex items-center justify-between'>
          <div>
            {[tags].map((tag: string) => {
              let color: string = 'green'
              if (tag === 'работает') {color = 'green'}
              if (tag === 'не работает') {color = 'yellow'}
    
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
          text: 'работает',
          value: 'работает'
        },
        {
          text: 'не работает',
          value: 'не работает'
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
