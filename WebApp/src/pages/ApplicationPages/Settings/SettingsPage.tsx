import { useState, useEffect, useRef } from 'react'
import { Typography, Layout, Avatar, Button, Statistic, Input, Card } from 'antd'
import { contentStyle } from '../../../global-style/layoutStyle'
import { HeaderComponent } from '../../../components/HeaderComponent/HeaderComponent'
import { MCard } from '../../../components/Card/MCard'
import { useSelector } from 'react-redux'
import { StoreState } from '../../../store/store'
import { BookOutlined, CheckOutlined, KeyOutlined, LinkOutlined, PlusOutlined, TagOutlined, UserOutlined, WarningOutlined } from '@ant-design/icons'
import { ProxySettingsInput } from './ProxySettingsInput'
import { Progress } from 'antd'
import { colors } from '../../../global-style/style-colors.module'
import { AvatarUploadComponent } from './AvatarUploadComponent'
import { AutoregHeader } from '../Autoreg/AutoregHeader'
import { StaticMessage } from '../../../components/StaticMessage/StaticMessage'
import styles from '../../../global-style/scroll-bar-style.module.css'
import { useContainerDimensions } from '../../../hooks/useContainerDimention'


const { Title } = Typography
const { Content } = Layout


export const SettingsPage = () => {
  const userName = useSelector((state: StoreState) => state.user.nick)
  const userAvatar = useSelector((state: StoreState) => state.app.userAvatar)

  const [accountsUsage, setAccountsUsage] = useState<number>(0)

  const container = useRef<HTMLInputElement>(null)
  const { height } = useContainerDimensions(container)
  
  useEffect(() => {
    setAccountsUsage(9.3)
  })

  return (
    <>
      <Layout style={contentStyle}>
        <HeaderComponent title='Настройки'/>

        <Content className='flex gap-8'>
          <div ref={container} className='flex flex-col w-[60%] max-w-[1100px] gap-8'>
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

          <div className="max-w-[700px] w-[40%]">
            <MCard className='px-2 py-2 w-full'>
              <AutoregHeader 
                title='Недавние действия' 
                dopTitle='Последняя информация об аккаунтах' 
              />
              <div style={{ height: height }} className={`flex flex-col gap-3 overflow-y-scroll overflow-x-hidden pr-[5px] ${styles.scroll_bar_style}`}>
                <StaticMessage 
                  title='Добавление аккаунтов'
                  dopTitle='Успешно добавлено 50 аккаунтов в новую папку'
                  type='success'
                  date='12 апреля, 2023'
                />
                <StaticMessage 
                  title='Добавление аккаунтов'
                  dopTitle='Успешно добавлено 50 аккаунтов в новую папку'
                  type='success'
                  date='12 апреля, 2023'
                />
                <StaticMessage 
                  title='Добавление аккаунтов'
                  dopTitle='Успешно добавлено 50 аккаунтов в новую папку'
                  type='warning'
                  date='12 апреля, 2023'
                />
                <StaticMessage 
                  title='Добавление аккаунтов'
                  dopTitle='Успешно добавлено 50 аккаунтов в новую папку'
                  type='error'
                  date='12 апреля, 2023'
                />
                <StaticMessage 
                  title='Добавление аккаунтов'
                  dopTitle='Успешно добавлено 50 аккаунтов в новую папку'
                  type='error'
                  date='12 апреля, 2023'
                />
                <StaticMessage 
                  title='Добавление аккаунтов'
                  dopTitle='Успешно добавлено 50 аккаунтов в новую папку'
                  type='error'
                  date='12 апреля, 2023'
                />
              </div>
            </MCard>
          </div>
        </Content>
      </Layout>
    </>
  )
}
