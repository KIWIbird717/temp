import { useState, useEffect } from 'react'
import { Typography, Layout, Avatar, Upload, message, Button, Statistic, Input } from 'antd'
import { contentStyle } from '../../../global-style/layoutStyle'
import { HeaderComponent } from '../../../components/HeaderComponent/HeaderComponent'
import { MCard } from '../../../components/Card/MCard'
import { useSelector } from 'react-redux'
import { StoreState } from '../../../store/store'
import { BookOutlined, CheckOutlined, KeyOutlined, LinkOutlined, PlusOutlined, TagOutlined, UploadOutlined, UserOutlined } from '@ant-design/icons'
import { ProxySettingsInput } from './ProxySettingsInput'
import { Progress } from 'antd'
import { colors } from '../../../global-style/style-colors.module'
import { AvatarUploadComponent } from './AvatarUploadComponent'
import { AutoregHeader } from '../Autoreg/AutoregHeader'
import { StaticMessage } from '../../../components/StaticMessage/StaticMessage'
import styles from '../../../global-style/scroll-bar-style.module.css'


const { Title } = Typography
const { Content } = Layout


export const SettingsPage = () => {
  const userName = useSelector((state: StoreState) => state.user.nick)
  const userAvatar = useSelector((state: StoreState) => state.app.userAvatar)
  const [accountsUsage, setAccountsUsage] = useState<number>(0)

  useEffect(() => {
    setAccountsUsage(9.3)
  })

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

  return (
    <>
      <Layout style={contentStyle}>
        <HeaderComponent title='Настройки'/>

        <Content className='flex gap-8'>
          <div className='flex flex-col w-full max-w-[1100px] gap-8'>
            <MCard title='Настройка профиля' className='w-full' extra={<Button disabled type='link' icon={<CheckOutlined />}>Применить</Button>}>
              <div className="flex items-start gap-8 justify-between">
                <div className="flex items-start gap-8">
                  <Avatar size={110} icon={userAvatar ? userAvatar : <UserOutlined />} />
                  <div className="flex flex-col items-start justify-start gap-3">
                    <p style={{ margin: '0 0' }}>Имя</p>
                    <Title editable style={{ margin: '0 0' }} level={2}>{userName}</Title>
                    <AvatarUploadComponent />
                  </div>
                </div>

                <div className="min-w-[300px] f-full">
                  <Statistic title="Использовано аккаунтов" value={93} suffix="/ 1000" />
                  <Progress percent={accountsUsage} strokeColor={colors.primary}/>
                </div>
              </div>
            </MCard>

            <MCard title='Настройка proxy Telegram' extra={<Button disabled type='link' icon={<PlusOutlined />}>Добавить</Button>}>
              <div className="flex gap-8 justify-between items-center">
                <div className="flex flex-col gap-3 w-full">
                  <ProxySettingsInput title='API hash'/>
                  <div className="flex flex-col gap-2">
                    <p style={{ margin: '0 0' }}>API id</p>
                    <Input prefix={<TagOutlined />} size='large' placeholder='API id' />
                  </div>
                </div>

                <div className="max-w-[270px] h-full flex flex-col gap-3">
                  <p style={{ margin: '0 0' }}>Данный API Hash и API ID необходимо взять на официальном сайте Telegram</p>
                  <div className="flex items-center gap-3">
                    <Button icon={<BookOutlined />}>Инструкция</Button>
                    <Button type='link' icon={<LinkOutlined />}>Ссылка</Button>
                  </div>
                </div>
              </div>
            </MCard>

            <MCard title='Добавить API ключ для СМС сервиса' extra={<Button disabled type='link' icon={<PlusOutlined />}>Добавить</Button>}>
              <div className="flex gap-8 justify-between items-center">
                <div className="flex flex-col gap-3 w-full">
                  <ProxySettingsInput title='API link'/>
                  <div className="flex flex-col gap-2">
                    <p style={{ margin: '0 0' }}>Secret key</p>
                    <Input prefix={<KeyOutlined />} size='large' placeholder='Secret key' />
                  </div>
                </div>

                <div className="max-w-[270px] h-full flex flex-col gap-3">
                  <p style={{ margin: '0 0' }}>Вы можете добавить свой СМС сервис, вствив API ссылку и Secret key</p>
                  <div className="flex items-center gap-3">
                    <Button icon={<BookOutlined />}>Инструкция</Button>
                  </div>
                </div>
              </div>
            </MCard>
          </div>

          <div className="max-w-[700px] w-full">
            <MCard className='px-2 py-2'>
              <div>
                <AutoregHeader 
                  title='Список СМС сервисов' 
                  dopTitle='Добавленные СМС сервисы' 
                />
              </div>
              <div 
                className={`flex flex-col gap-3 overflow-y-scroll overflow-x-hidden pr-[5px] ${styles.scroll_bar_style}`}
              >
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
        </Content>
      </Layout>
    </>
  )
}
