import { Typography, Layout, Avatar, Upload, message, Button, Statistic, Input } from 'antd'
import { contentStyle } from '../../../global-style/layoutStyle'
import { HeaderComponent } from '../../../components/HeaderComponent/HeaderComponent'
import { MCard } from '../../../components/Card/MCard'
import { useSelector } from 'react-redux'
import { StoreState } from '../../../store/store'
import type { UploadProps } from 'antd';
import { BookOutlined, CheckOutlined, KeyOutlined, LinkOutlined, PlusOutlined, TagOutlined, UploadOutlined, UserOutlined } from '@ant-design/icons'
import { ProxySettingsInput } from './ProxySettingsInput'
import { colors } from '../../../global-style/style-colors.module'

const { Title } = Typography
const { Content } = Layout

const AvatarAploadComponent = () => {
  const uploadProps: UploadProps = {
    name: 'file',
    /**@todo connect to DB */
    action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
    headers: {
      authorization: 'authorization-text',
    },
    onChange(info) {
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === 'done') {
        message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <Upload {...uploadProps}>
        <Button icon={<UploadOutlined />}>Загрузить аватар</Button>
      </Upload>
    </div>
  )
}

export const SettingsPage = () => {
  const userName = useSelector((state: StoreState) => state.user.nick)

  return (
    <>
      <Layout style={contentStyle}>
        <HeaderComponent title='Настройки'/>

        <Content className='flex gap-8'>
          <div className='flex flex-col w-full h-full max-w-[900px] gap-8'>
            <MCard title='Настройка профиля' className='w-full h-full px-2 py-2' extra={<Button disabled type='link' icon={<CheckOutlined />}>Применить</Button>}>
              <div className="flex items-start gap-8 justify-between">
                <div className="flex items-start gap-8">
                  <Avatar size={110} icon={<UserOutlined />} />
                  <div className="flex flex-col gap-3">
                    <p style={{ margin: '0 0' }}>Имя</p>
                    <Title editable style={{ margin: '0 0' }} level={2}>{userName}</Title>
                    <AvatarAploadComponent />
                  </div>
                </div>
                <Statistic title="Использовано аккаунтов" value={93} suffix="/ 1000" />
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

          {/* <MCard className='w-full max-w-[800px]'>
            <Title>Дополнительная информация</Title>
          </MCard> */}

        </Content>
      </Layout>
    </>
  )
}
