import type { ColumnsType } from 'antd/es/table';
import proxyFolders from '../../../images/proxyFolder.svg'
import { Typography, Button } from 'antd'
import { useDispatch } from 'react-redux';
import { setProxyManagerFolder } from '../../../store/appSlice';
import { FolderOpenOutlined, SafetyCertificateTwoTone } from '@ant-design/icons';
import { colors } from '../../../global-style/style-colors.module';
import styles from './style.module.css'

export interface IHeaderType {
  key: React.Key,
  folder: string,
  dopTitle: string,
  peoxies: number,
  country: string,
  latestActivity: string,
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
          <div 
            className={`${styles.folder_style} flex items-center gap-5 p-2 rounded-md hover:bg-slate-50`}
            onClick={() => dispatch(setProxyManagerFolder(record.key))}
          >
            <div className='h-[110px] object-contain'>
              <img className='w-full h-full' src={proxyFolders} alt='icon'/>
            </div>
            <div className="flex flex-col gap-1">
              <Title style={{ margin: '0px 0px' }} level={4}>{record.folder}</Title>
              <Title style={{ margin: '0px 0px', fontWeight: '400' }} type='secondary' level={5}>{record.dopTitle}</Title>
            </div>
          </div>
          <Button icon={<FolderOpenOutlined />} onClick={() => dispatch(setProxyManagerFolder(record.key))}>Открыть</Button>
        </div>
      )
    },
    {
      title: 'Кол-во proxy',
      dataIndex: 'peoxies',
      render: (accounts: number) => (
        <div className="flex gap-2">
          <Title style={{ margin: '0px 0px' }} level={5}>{accounts}</Title>
          <SafetyCertificateTwoTone twoToneColor={colors.accent}/>
        </div>
      ),
    },
    {
      title: 'Страна',
      dataIndex: 'country',
    },
    {
      title: 'Последнее изменение',
      dataIndex: 'latestActivity',
    },
  ]

  return tableHeaders
}


export const tableData: IHeaderType[] = [
  {
    key: '1',
    folder: 'Proxy',
    dopTitle: 'Аккаунты для прогрева',
    peoxies: 12,
    country: 'Финляндия',
    latestActivity: '22 апреля, 2023',
  },
  {
    key: '2',
    folder: 'Proxy',
    dopTitle: 'Аккаунты для каналов',
    peoxies: 24,
    country: 'Германия',
    latestActivity: '22 апреля, 2023',
  },
  {
    key: '3',
    folder: 'Proxy',
    dopTitle: 'Аккаунты для переписок',
    peoxies: 24,
    country: 'Тайланд',
    latestActivity: '22 апреля, 2023',
  },
  {
    key: '4',
    folder: 'Proxy',
    dopTitle: 'Аккаунты для переписок',
    peoxies: 24,
    country: 'Тайланд',
    latestActivity: '22 апреля, 2023',
  },
]

