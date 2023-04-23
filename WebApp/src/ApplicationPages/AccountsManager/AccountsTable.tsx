import React, { useState, useRef } from 'react'
import { MCard } from '../../components/Card/MCard'
import { Typography, Table, Button, Select, Input } from 'antd'
import { ParseAccountsTable, tableHeaders } from './ParseAccountsTable'
import { ArrowLeftOutlined, CloseOutlined, EditOutlined } from '@ant-design/icons'
import { useDispatch } from 'react-redux'
import { setAccountsManagerFolder } from '../../store/appSlice'
import { IAccountsData } from './ParseAccountsTable'
// import Highlighter from 'react-highlight-words'


const { Title } = Typography
const { Search } = Input

export const AccountsTable = () => {
  const dispatch = useDispatch()
  const [selectedFolders, setSelectedFolders] = useState<IAccountsData[]>([])
  const [selectionType, setSelectionType] = useState<boolean>(false)
  // Table Search
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  // const searchInput = useRef<InputRef>(null);

  const rowSelection = {
    onChange: (selectedRowKey: React.Key[], selectedRows: IAccountsData[]) => {
      setSelectedFolders(selectedRows)
      // console.log(`selectedRowKeys: ${selectedRowKey}, selectedRows: ${selectedRows}`)
    },
    getCheckboxProps: (record: IAccountsData) => ({
      disabled: record.key === 'Disabled User', // Column configuration not to be checked
      key: record.key,
    }),
  }

  return (
    <MCard className='h-full py-2 px-2'>
      <div className="flex flex-col gap-7">
        <div className="flex justify-between">
          <div className="flex  gap-3">
            <Button onClick={() => dispatch(setAccountsManagerFolder(null))} className='border-[0px] shadow-md' size='large' shape="circle" icon={<ArrowLeftOutlined />} />
            <Search
              className='w-[300px]'
              placeholder="Поиск по ФИО"
              allowClear
              enterButton="Поиск"
              size="large"
              // onSearch={() => console.log('search)}
            />
          </div>
          <Button 
            className='border-[0px] shadow-md' 
            size='large' 
            shape="circle" 
            icon={selectionType ? <CloseOutlined /> : <EditOutlined />} 
            onClick={() => setSelectionType(!selectionType)} 
          />
        </div>
        <Table
          size='large'
          pagination={{ pageSize: 9 }}
          rowSelection={selectionType ? { type: 'checkbox', ...rowSelection } : undefined}
          columns={tableHeaders}
          dataSource={ParseAccountsTable()}
        />
      </div>
    </MCard>
  )
}
