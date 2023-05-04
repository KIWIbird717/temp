import type { ColumnsType } from 'antd/es/table';
import tableCard from '../../../images/tableCard.svg'
import { Typography, Button, Input, Dropdown, MenuProps, message, Avatar, Divider } from 'antd'
import { useDispatch } from 'react-redux';
import { setAccountsManagerFolder } from '../../../store/appSlice';
import { AntDesignOutlined, CheckSquareOutlined, DeleteOutlined, EditOutlined, EnterOutlined, FolderOpenOutlined, IdcardTwoTone, MoreOutlined, UploadOutlined, UserOutlined } from '@ant-design/icons';
import { colors } from '../../../global-style/style-colors.module';

export interface IHeaderType {
  key: React.Key,
  folder: string,
  dopTitle: string,
  accounts: number,
  country: string,
  latestActivity: string,
  banned: number
}

const { Title } = Typography

export const TableHeaders = (): ColumnsType<IHeaderType> => {
  const dispatch = useDispatch()

  // Dropdown menu items & onClick function
  const dropDownItems: MenuProps['items'] = [
    {
      key: '0',
      label: 'Переименовать',
      icon: <EditOutlined />
    },
    {
      key: '2',
      label: 'Экспорт"',
      icon: <UploadOutlined />,
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
  const onClick: MenuProps['onClick'] = ({ key }) => {
    message.info(`Click on item ${key}`)
  }

  /**
   * Setting table body for `folders`table
   */
  const tableHeaders: ColumnsType<IHeaderType> = [
    {
      title: 'Папка',
      dataIndex: 'folder',
      render: (_, record) => (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-5">
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
      dataIndex: 'accounts',
      render: (accounts: number) => (
        <div className="flex gap-1 items-center">
          <Title style={{ margin: '0px 0px' }} level={5}>{accounts}</Title>
          <Divider type="vertical"/>
          <Avatar.Group maxCount={2} maxStyle={{ color: '#f56a00', backgroundColor: '#fde3cf' }} maxPopoverTrigger="focus">
            <Avatar src="https://xsgames.co/randomusers/avatar.php?g=pixel&key=2" />
            <Avatar style={{ backgroundColor: colors.accent }}>K</Avatar>
            <Avatar style={{ backgroundColor: '#87d068' }} icon={<UserOutlined />} />
            {new Array(accounts-3).fill(0).map(() => (
              <Avatar style={{ backgroundColor: '#1890ff' }} icon={<AntDesignOutlined />} />
            ))}
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
      render: (banned: number) => (
        <div className="w-full flex justify-between">
          {banned}
          <Dropdown menu={{ items: dropDownItems, onClick }} trigger={['click']}>
            <Button style={{ borderWidth: '0px', boxShadow: 'inherit' }} shape="circle" icon={<MoreOutlined />} />
          </Dropdown>
        </div>
      )
    }
  ]

  return tableHeaders
}


