import { useState } from 'react'
import { MCard } from '../../../components/Card/MCard'
import { Input, Table, Tooltip, Button, message } from 'antd'
import { motion } from 'framer-motion'
import { IProxyHeaderType, TableHeaders } from './Collumns'
import { CloseOutlined, ContainerOutlined, EditOutlined } from '@ant-design/icons'
import { notificationHandler } from '../../../components/notification'
import { MSelect } from '../../../components/Select/MSelect'
import { MSearch } from '../../../components/Search/MSearch'
import { StoreState } from '../../../store/store'
import { useSelector } from 'react-redux'


export const Folders = () => {
  const tableData: IProxyHeaderType[] | null = useSelector((state: StoreState) => state.user.userProxyFolders)
  console.log({tableData})

  const [selectionType, setSelectionType] = useState<boolean>(false)
  const [selectedFolders, setSelectedFolders] = useState<IProxyHeaderType[]>([])

  const exportSelectedFolders = () => {
    if (selectedFolders.length) {
      notificationHandler({
        type: 'success',
        msg: 'Папки успешно экспортированы',
        place: 'bottomRight'
      })
    } else {
      message.warning('Не выбрано ниодной папки')
    }
  }

  const rowSelection = {
    onChange: (selectedRowKey: React.Key[], selectedRows: IProxyHeaderType[]) => {
      setSelectedFolders(selectedRows)
      // console.log(`selectedRowKeys: ${selectedRowKey}, selectedRows: ${selectedRows}`)
    },
    getCheckboxProps: (record: IProxyHeaderType) => ({
      disabled: record.folder === 'Disabled User', // Column configuration not to be checked
      folder: record.folder,
    }),
  }

  return (
    <div className="flex gap-8">
      <MCard className='w-full px-2 py-2'>
        <div className="flex flex-col gap-7">
          <div className="flex items-center justify-between">
            <div className="flex gap-3 mr-2">
              <MSelect 
                size='large'
                defaultValue="Страна"
                style={{ width: 200 }}
                // onChange={handleChange}
                // options={options}
              />
              <MSearch 
                placeholder="Поиск по папкам"
                allowClear
                enterButton="Поиск"
                size="large"
                // onSearch={() => console.log('search)}
              />
            </div>
            <div className="flex gap-3">
              {selectionType ? (
                <motion.div
                  initial={{ x: 100, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.3, type: 'spring' }}
                >
                  <Tooltip title='Экспорт в архив'>
                    <Button className={`border-[0px] shadow-md`} size='large' shape="circle" icon={<ContainerOutlined />} onClick={() => exportSelectedFolders()}/>
                  </Tooltip>
                </motion.div>
              ) : (
                <div className="w-[40px] h-[40px]" />
              )}
              <Button 
                className='border-[0px] shadow-md' 
                size='large' 
                shape="circle" 
                icon={selectionType ? <CloseOutlined /> : <EditOutlined />} 
                onClick={() => setSelectionType(!selectionType)} 
              />
            </div>
          </div>
          
          <div>
            <Table
              size='large'
              rowSelection={selectionType ? { type: 'checkbox', ...rowSelection } : undefined}
              columns={TableHeaders()}
              dataSource={tableData || []}
              pagination={{ pageSize: 4 }}
            />
          </div>
        </div>
      </MCard>
    </div>
  )
}

