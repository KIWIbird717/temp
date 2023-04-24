import type { ColumnsType } from 'antd/es/table';
import tableCard from '../../images/tableCard.svg'
import { Typography, Button, Input } from 'antd'
import { useDispatch } from 'react-redux';
import { setAccountsManagerFolder } from '../../store/appSlice';

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

export const TableHeaders = () => {
  const dispatch = useDispatch()

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
          <Button onClick={() => dispatch(setAccountsManagerFolder(record.key))}>Открыть папку</Button>
        </div>
      )
    },
    {
      title: 'Аккаунты',
      dataIndex: 'accounts',
      render: (accounts: number) => (
        <Title style={{ margin: '0px 0px' }} level={5}>{accounts}</Title>
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
      dataIndex: 'banned'
    }
  ]

  return tableHeaders
}


export const tableData: IHeaderType[] = [
  {
    key: '1',
    folder: 'Telegram',
    dopTitle: 'Аккаунты для прогрева',
    accounts: 12,
    country: 'Finland',
    latestActivity: '22 апреля',
    banned: 0,
  },
  {
    key: '2',
    folder: 'Telegram',
    dopTitle: 'Аккаунты для каналов',
    accounts: 24,
    country: 'Finland',
    latestActivity: '22 апреля',
    banned: 0
  },
  {
    key: '3',
    folder: 'Telegram',
    dopTitle: 'Аккаунты для переписок',
    accounts: 24,
    country: 'Finland',
    latestActivity: '22 апреля',
    banned: 0
  },
]

