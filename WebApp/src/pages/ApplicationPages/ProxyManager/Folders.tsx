import Reac, { useRef, useState } from 'react'
import { MCard } from '../../../components/Card/MCard'
import { Select, Input, Table, Tooltip, Button, message, Typography } from 'antd'
import { motion } from 'framer-motion'
import { IHeaderType, TableHeaders, tableData } from './Collumns'
import { CloseOutlined, ContainerOutlined, EditOutlined } from '@ant-design/icons'
import { notificationHandler } from '../../../components/notification'
import { AutoregHeader } from '../Autoreg/AutoregHeader'
import { StaticMessage } from '../../../components/StaticMessage/StaticMessage'
import { useContainerDimensions } from '../../../hooks/useContainerDimention'


const { Search } = Input
const { Title } = Typography

export const Folders = () => {
  const [selectionType, setSelectionType] = useState<boolean>(false)
  const [selectedFolders, setSelectedFolders] = useState<IHeaderType[]>([])

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
    onChange: (selectedRowKey: React.Key[], selectedRows: IHeaderType[]) => {
      setSelectedFolders(selectedRows)
      // console.log(`selectedRowKeys: ${selectedRowKey}, selectedRows: ${selectedRows}`)
    },
    getCheckboxProps: (record: IHeaderType) => ({
      disabled: record.folder === 'Disabled User', // Column configuration not to be checked
      folder: record.folder,
    }),
  }

  type smsServicesTypes = {
    title: string,
    type: "error" | "warning" | "success" | "service"
  }

  const smsServicesList: smsServicesTypes[] = [
    {
      title: 'SMS-Activate API',
      type: 'service'
    },
    {
      title: 'SMS-Activator',
      type: 'service'
    },
    {
      title: 'SMS-Service',
      type: 'service'
    },
    {
      title: 'SMS-Phones',
      type: 'service'
    }
  ]

  const card = useRef<HTMLInputElement>(null)
  const dopCardTitleRef = useRef<HTMLInputElement>(null)
  const { height } = useContainerDimensions(card)
  const cardTitleHeight = useContainerDimensions(dopCardTitleRef).height

  return (
    <div className="h-full flex gap-8">
      <MCard className='h-full w-full px-2 py-2 max-w-[1200px]'>
        <div ref={card} className="flex flex-col gap-7">
          <div className="flex items-center justify-between">
            <div className="flex gap-3 mr-2">
              <Select
                className='w-[300px]'
                size='large'
                defaultValue="Страна"
                // onChange={handleChange}
                style={{ width: 200 }}
                // options={options}
              />
              <Search
                className='w-[300px]'
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
              dataSource={tableData}
              pagination={{ pageSize: 4 }}
            />
          </div>
        </div>
      </MCard>

      <div className="w-full max-w-[400px]">
        <MCard className='px-2 py-2'>
          <div ref={dopCardTitleRef}>
            <AutoregHeader 
              title='Список СМС сервисов' 
              dopTitle='Добавленные СМС сервисы' 
            />
          </div>
          <div style={ smsServicesList.length > 8 ? { height: height-cardTitleHeight-30 } : undefined} className="flex flex-col gap-3 overflow-y-scroll overflow-x-hidden pr-[5px] ">
          {smsServicesList.map((service: smsServicesTypes, index) => (
            <StaticMessage 
              key={index}
              title={service.title}
              type={service.type}
            />
          ))}
          </div>
        </MCard>
      </div>
    </div>
  )
}