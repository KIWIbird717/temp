import { useRef, useState } from 'react'
import { MCard } from '../../../components/Card/MCard'
import { Table, Tooltip, Button, message, Modal } from 'antd'
import { motion } from 'framer-motion'
import { IHeaderType, TableHeaders } from './Collumns'
import { 
  AppstoreAddOutlined, 
  CloseOutlined, 
  ContainerOutlined, 
  DeleteOutlined, 
  DragOutlined, 
  EditOutlined, 
} from '@ant-design/icons'
import { notificationHandler } from '../../../components/notification'
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable'
import type { DragEndEvent } from '@dnd-kit/core';
import { DndContext } from '@dnd-kit/core';
import { FolderRow } from './FolderRow'
import { ColumnsType } from 'antd/es/table'
import { MSelect } from '../../../components/Select/MSelect'
import { MSearch } from '../../../components/Search/MSearch'
import { useSelector, useDispatch } from 'react-redux'
import { StoreState } from '../../../store/store'
import { setUserManagerFolders } from '../../../store/userSlice'


interface IEditButton {
  id: React.Key,
  icon: React.ReactNode,
  danger?: boolean,
  toolTip: string,
  onClick: () => void
}

export const Folders = () => {
  const dispatch = useDispatch()
  const folders = useSelector((state: StoreState) => state.user.userManagerFolders)
  const changedFoldersRef = useRef<IHeaderType[] | null>(null)

  const [selectionType, setSelectionType] = useState<boolean>(false)
  const [selectedFolders, setSelectedFolders] = useState<IHeaderType[]>([])
  const [dataSource, setDataSource] = useState<IHeaderType[] | null>(folders)
  const [headers, setHeaders] = useState<ColumnsType<IHeaderType>>(TableHeaders())
  const [dragHandler, setDragHandler] = useState<boolean>(false)

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

  const headersRef = TableHeaders()
  const handleDragFolders = (): void => {
    if (!dragHandler) {
      setHeaders([{ key: 'sort' }, ...headersRef])
      setDragHandler(true)
      return
    }
    setHeaders(headersRef)
    setDragHandler(false)
    return
  }

  const editButtons: IEditButton[] = [
    {
      id: '0',
      icon: <DeleteOutlined />,
      toolTip: 'Удалить',
      danger: true,
      onClick: () => exportSelectedFolders()
    },
    {
      id: '1',
      icon: <AppstoreAddOutlined />,
      toolTip: 'Объеденить',
      onClick: () => exportSelectedFolders()
    },
    {
      id: '2',
      icon: <ContainerOutlined />,
      toolTip: 'Экспорт в архив',
      onClick: () => exportSelectedFolders()
    },
  ]

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

  const onDragEnd = ({ active, over }: DragEndEvent) => {
    if (active.id !== over?.id) {
      setDataSource((previous) => {
        if (!previous) return null
        const previousIndex = previous.findIndex((i) => i.key === active.id)  // Index of prev element of array
        const overIndex = previous.findIndex((i) => i.key === over?.id) // Current index of element

        const currentArray = arrayMove(previous, previousIndex, overIndex) // Array with changed index
        const changeArrayKey: IHeaderType[] = currentArray.map((el, index) => ({...el, key: index})) // Set key prop of changed array
        changedFoldersRef.current = changeArrayKey

        return currentArray
      })
    }
    if (changedFoldersRef.current !== null) {
      setTimeout(() => {dispatch(setUserManagerFolders(changedFoldersRef.current))}, 1000)
    }
  };

  return (
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
              editButtons.map((button: IEditButton) => (
                <motion.div
                  key={button.id}
                  initial={{ x: 100, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.3, type: 'spring', delay: Number(button.id) * 0.1}}
                  className='flex gap-3'
                >
                  <Tooltip title={button.toolTip}>
                   <Button danger={button?.danger} className={`border-[0px] shadow-md`} size='large' shape="circle" icon={button.icon} onClick={() => exportSelectedFolders()}/>
                  </Tooltip>
                </motion.div>
              ))
            ) : (
              <div className="w-[40px] h-[40px]" />
            )}
            <Button 
              className='border-[0px] shadow-md' 
              size='large' 
              shape="circle" 
              icon={selectionType ? <CloseOutlined /> : <EditOutlined />} 
              onClick={() => {setSelectionType(!selectionType); setHeaders(headersRef); setDragHandler(false)}} 
            />
            <Button 
              className='border-[0px] shadow-md' 
              size='large' 
              shape="circle" 
              icon={dragHandler ? <CloseOutlined /> : <DragOutlined />} 
              onClick={() => handleDragFolders()} 
            />
          </div>
        </div>
        
        <div>
          <DndContext onDragEnd={onDragEnd}>
            <SortableContext
              items={dataSource?.map((i) => i.key) || []}
              strategy={verticalListSortingStrategy}
            >
              <Table
                components={{
                  body: {
                    row: FolderRow,
                  },
                }}
                size='large'
                rowSelection={selectionType ? { type: 'checkbox', ...rowSelection } : undefined}
                columns={headers}
                dataSource={dataSource || []}
              />
            </SortableContext>
          </DndContext>
        </div>
      </div>
    </MCard>
  )
}
