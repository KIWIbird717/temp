import type { ColumnsType } from 'antd/es/table';
import tableCard from '../../../images/tableCard.svg'
import { Typography, Button, Dropdown, message, Avatar, Divider } from 'antd'
import { useDispatch } from 'react-redux';
import { setAccountsManagerFolder } from '../../../store/appSlice';
import { AntDesignOutlined, DeleteOutlined, EditOutlined, FolderOpenOutlined, MoreOutlined, UploadOutlined, UserOutlined } from '@ant-design/icons';
import { colors } from '../../../global-style/style-colors.module';
import styles from './style.module.css'
import { IAccountsData } from './ParseAccountsTable';
import { Dispatch, SetStateAction } from 'react';

export interface IHeaderType {
  key: React.Key,
  folder: string,
  dopTitle: string,
  accountsAmount: number,
  country: string,
  latestActivity: Date | string,
  banned: number,
  accounts: IAccountsData[]
}

const { Title } = Typography

interface ITableHeaders {
  setDeleteModal: Dispatch<SetStateAction<{open: boolean, record: IHeaderType | null}>>
}

export const TableHeaders = ({setDeleteModal}: ITableHeaders): ColumnsType<IHeaderType> => {
  const dispatch = useDispatch()

  /**
   * Setting table body for `folders`table
   */
  const tableHeaders: ColumnsType<IHeaderType> = [
    {
      title: 'Папка',
      dataIndex: 'folder',
      render: (_, record) => (
        <div className="flex items-center justify-between">
          <div 
            className={`${styles.folder_style} flex items-center gap-5 p-2 rounded-md hover:bg-slate-50`}
            onClick={() => dispatch(setAccountsManagerFolder(record.key))}
          >
            <div className='h-[110px] object-contain'>
              <img className='w-full h-full' src={tableCard} alt='icon'/>
            </div>
            <div className="flex flex-col gap-1">
              <Title style={{ margin: '0px 0px' }} level={4}>{record.folder}</Title>
              <Title style={{ margin: '0px 0px', fontWeight: '400' }} type='secondary' level={5}>{record.dopTitle}</Title>
            </div>
          </div>
          <Button 
            icon={<FolderOpenOutlined />} 
            onClick={() => dispatch(setAccountsManagerFolder(record.key))}
          >Открыть</Button>
        </div>
      )
    },
    {
      title: 'Аккаунты',
      dataIndex: 'accountsAmount',
      render: (accountsAmount: number) => (
        <div className="flex gap-1 items-center">
          <Title style={{ margin: '0px 0px' }} level={5}>{accountsAmount}</Title>
          <Divider type="vertical"/>
          <Avatar.Group maxCount={2} maxStyle={{ color: '#f56a00', backgroundColor: '#fde3cf' }} maxPopoverTrigger="focus">
            <Avatar src="https://xsgames.co/randomusers/avatar.php?g=pixel&key=2" />
            <Avatar style={{ backgroundColor: colors.accent }}>K</Avatar>
            <Avatar style={{ backgroundColor: '#87d068' }} icon={<UserOutlined />} />
            {accountsAmount > 0 ? (
              new Array(accountsAmount).fill(0).map(() => (
                <Avatar style={{ backgroundColor: '#1890ff' }} icon={<AntDesignOutlined />} />
              ))
            ) : (
              <div className="div"></div>
            )}
          </Avatar.Group>
        </div>
      ),
    },
    {
      title: 'Страна',
      dataIndex: 'country',
    },
    {
      title: 'Последняя активность',
      dataIndex: 'latestActivity',
    },
    {
      title: 'Заблокировано',
      dataIndex: 'banned',
      render: (banned: number, record) => (
        <div className="w-full flex justify-between">
          {banned}
          <Dropdown 
            menu={
              { 
                items: [
                  {
                    key: '0',
                    label: 'Переименовать',
                    icon: <EditOutlined />,
                    // onClick: () => warnMessage()
                  },
                  {
                    key: '1',
                    label: 'Экспорт"',
                    icon: <UploadOutlined />,
                    // onClick: () => warnMessage()
                  },
                  {
                    type: 'divider',
                  },
                  {
                    key: '2',
                    label: 'Удалить',
                    icon: <DeleteOutlined />,
                    danger: true,
                    onClick: () => setDeleteModal({open: true, record: record})
                  },
                ],
                onClick: ({ key }) => {
                  if (key === '1' || key === '0' ) {
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


