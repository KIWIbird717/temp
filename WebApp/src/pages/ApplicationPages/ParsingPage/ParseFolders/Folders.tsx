import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { MCard } from '../../../../components/Card/MCard'
import { AnimatePresence, motion } from 'framer-motion'
import { Button, ConfigProvider, Dropdown, Modal, Table, Tooltip } from 'antd'
import { CloseOutlined, ContainerOutlined, DeleteOutlined, EditOutlined, MoreOutlined, PlusOutlined } from '@ant-design/icons'
import { useDispatch } from 'react-redux'
import styles from '../../ProxyManager/style.module.css'
import { ColumnsType } from 'antd/es/table'
import { setParseManagerFolder } from '../../../../store/appSlice'
import groupFolder from '../../../../images/groupFolder.svg'
import accountsFolder from '../../../../images/accountsFolder.svg'
import { Typography } from 'antd'
import type { IParseFolders } from '../../../../store/types'
import { notificationHandler } from '../../../../components/notification'
import { message } from 'antd'
import { useSelector } from 'react-redux'
import { StoreState } from '../../../../store/store'
import { ModalAddNewParsingFolder } from './ModalAddNewParsingFolder'
import { colors } from '../../../../global-style/style-colors.module'
import { NoParseFolders } from '../../../../components/CustomNoData/NoParseFolders'
import { setUserParsingFolders } from '../../../../store/userSlice'
import axios from 'axios'


const { Title } = Typography

interface ITableHeaders {
  setDeleteModal: Dispatch<SetStateAction<{ open: boolean; record: IParseFolders | null; }>>
}

const TableHeaders = ({setDeleteModal}: ITableHeaders) => {
  const dispatch = useDispatch()

  const tableHeaders: ColumnsType<IParseFolders> = [
    {
      title: 'Папка',
      dataIndex: 'title',
      render: (_, record) => {
        return (
        <div className='flex items-center justify-between'>
          <div 
            className={`${styles.folder_style} w-full flex items-center gap-5 p-2 rounded-md hover:bg-slate-50`}
            onClick={() => dispatch(setParseManagerFolder(record.key))}
          >
            <div className="h-[110px] object-contain">
              <img src={record.type === 'accounts' ? accountsFolder : groupFolder} className='w-full h-full' alt='groupFolder'/>
            </div>
            <div className="flex flex-col gap-1">
              <Title style={{ margin: '0 0', color: colors.font }} level={4}>{record.title}</Title>
              <Title style={{ margin: '0 0', fontWeight: '400', color: colors.dopFont }} level={5}>{record.title}</Title>

            </div>
          </div>
        </div>)
      }
    },
    {
      title: 'Действия',
      dataIndex: 'title',
      render: (_, record) => (
        <div className="flex justify-end">
          <Dropdown 
            menu={
              { 
                items: [
                  {
                    key: '1',
                    label: 'Удалить',
                    icon: <DeleteOutlined />,
                    danger: true,
                    onClick: () => setDeleteModal({open: true, record: record})
                  },
                ],
                onClick: ({ key }) => {
                  if (key === '2' || key === '0' ) {
                    message.warning(`Временно не доступно`)
                  }
                }
              }
            } 
            trigger={['click']}
          >
            <Button style={{ borderWidth: '0px', boxShadow: 'inherit' }} shape="circle" icon={<MoreOutlined />} />
          </Dropdown>
        </div>
      )
    }
  ]
  return tableHeaders
}

export const Folders = () => {
  const [messageApi] = message.useMessage()
  const dispatch = useDispatch()
  const userMail = useSelector((state: StoreState) => state.user.mail)

  const tableDataRaw: IParseFolders[] | null = useSelector((state: StoreState) => state.user.userParsingFolders)
  const [tableData, setTableData] = useState<IParseFolders[] | null>(null)

  const [selectionType, setSelectionType] = useState<boolean>(false)
  const [proxyModal, setProxyModal] = useState<boolean>(false)

  const [selectedFolders, setSelectedFolders] = useState<IParseFolders[]>([])

  const [deleteModal, setDeleteModal] = useState<{open: boolean, record: IParseFolders | null}>({open: false, record: null})
  

  const parsingFoldersFromDB = async (mail: string): Promise<void> => {
    try {
      const url = `${process.env.REACT_APP_SERVER_END_POINT}/parsingFolder/get-pasing-folders/${mail}`
      if (mail) {
        const folders = await axios.get(url)
        if (folders.status === 200) {
          dispatch(setUserParsingFolders(folders.data))
        } else {
          console.error('Error occured while trying handle accounts folders')
        }
      }
    } catch (err) {
      console.error(err)
    }
  }

  const rowSelection = {
    onChange: (selectedRowKey: React.Key[], selectedRows: IParseFolders[]) => {
      setSelectedFolders(selectedRows)
      // console.log(`selectedRowKeys: ${selectedRowKey}, selectedRows: ${selectedRows}`)
    },
    getCheckboxProps: (record: IParseFolders) => ({
      disabled: record.title === 'Disabled User', // Column configuration not to be checked
      folder: record.title,
    }),
  }

  const deleteFolders = async (record: IParseFolders | null) => {
    if (!record) return
    if (!userMail) return

    try {
      const url = `${process.env.REACT_APP_SERVER_END_POINT}/parsingFolder/delete-parsing-folder`

      // update folders localy
      const updatedFolders = tableDataRaw?.filter((folder) => folder.key !== record.key)
      if (updatedFolders) {
        dispatch(setUserParsingFolders(updatedFolders))
      }

      // update folders in DB
      axios.post(url, { mail: userMail, folderKey: record.key })
        .then((res) => {
          if (res.status === 200) {
            message.success(`Папка успешно удалена`)
          } else {
            message.error('Ошибка при удалении папки')
            if (tableDataRaw) {
              dispatch(setUserParsingFolders([...tableDataRaw, record]))
            } else {
              dispatch(setUserParsingFolders([record]))
            }
          }
        })

        setDeleteModal({open: false, record: null})
    } catch (err) {
      
    }
  }

  useEffect(() => {
    if (userMail) {
      parsingFoldersFromDB(userMail)
    }
  }, [])

  useEffect(() => {
    setTableData(tableDataRaw)
  }, [tableDataRaw])

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

  return (
    <div>
      <Modal
        title="Удаление папки с парсингом"
        open={deleteModal.open}
        onOk={() => deleteFolders(deleteModal.record)}
        onCancel={() => setDeleteModal({open: false, record: null})}
        okButtonProps={{ danger: true }}
        okText='Удалить'
        cancelText='Отмена'
      >
        <p>Вы уверены, что хотите удалить папку <span style={{ fontWeight: 700 }}>{deleteModal.record?.title}</span>? Все аккаунты из этой папки будут удалены. Это действие не возможно обратить.</p>
      </Modal>
      
      <MCard className='w-full p-2'>
        <div className="flex flex-col gap-7">
          <div className="flex items-center justify-between">
            <div className="flex gap-3 mr-2">
              {/* <MSelect 
                size='large'
                defaultValue="Страна"
                style={{ width: 200 }}
                onChange={handleChange}
                options={options}
              />
              <MSearch 
                placeholder="Поиск по папкам"
                allowClear
                enterButton="Поиск"
                size="large"
                onSearch={() => console.log('search)}
              /> */}
              <Title style={{ margin: '0 0' }} level={4}>Группы, чаты, каналы</Title>
            </div>
            <div className="flex gap-3">
              {selectionType ? (
                <AnimatePresence>
                  <motion.div
                    initial={{ x: 100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.3, type: 'spring', delay: 0.1 }}
                    className='flex gap-3'
                  >
                    <Tooltip title='Экспорт в архив'>
                      <Button className={`border-[0px] shadow-md`} size='large' shape="circle" icon={<ContainerOutlined />} onClick={() => exportSelectedFolders()}/>
                    </Tooltip>
                  </motion.div>
                  {/* <motion.div
                    initial={{ x: 100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.3, type: 'spring' }}
                    className='flex gap-3'
                  >
                    <Tooltip title='Удалить выделенное'>
                      <Button 
                        danger 
                        size='large' 
                        shape="circle" 
                        icon={<DeleteOutlined />} 
                        className={`border-[0px] shadow-md`} 
                        onClick={() => deleteSelectedAccounts()}
                      />
                    </Tooltip>
                  </motion.div> */}
                </AnimatePresence>
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
              <Tooltip title='Добавить новую папку'>
                <Button 
                  className='border-[0px] shadow-md' 
                  size='large' 
                  shape="circle" 
                  icon={<PlusOutlined />} 
                  onClick={() => setProxyModal(true)}
                />
              </Tooltip>
              <ModalAddNewParsingFolder 
                open={proxyModal} 
                onOk={() => setProxyModal(false)}
                onCancel={() => setProxyModal(false)}
              />
            </div>
          </div>
          
          <div>
            <ConfigProvider renderEmpty={NoParseFolders}>
              <Table
                style={{ margin: '0 0' }}
                // size='large'
                rowSelection={selectionType ? { type: 'checkbox', ...rowSelection } : undefined}
                columns={TableHeaders({setDeleteModal})}
                dataSource={tableData || []}
                pagination={{ pageSize: 5 }}
              />
            </ConfigProvider> 
          </div>
        </div>
      </MCard>
    </div>
  )
}
