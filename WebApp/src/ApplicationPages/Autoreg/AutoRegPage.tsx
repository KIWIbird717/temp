import { Typography, Layout, Segmented, Button, Cascader, InputNumber, Statistic, Popover } from 'antd'
import { contentStyle } from '../../global-style/layoutStyle'
import { HeaderComponent } from '../../components/HeaderComponent/HeaderComponent'
import { MCard } from '../../components/Card/MCard'
import { colors } from '../../global-style/style-colors.module'
import { FolserSelection } from './FolserSelection'
import img1 from '../../images/img1.svg'
import img2 from '../../images/img2.svg'
import img3 from '../../images/img3.svg'
import { CheckOutlined, InfoCircleOutlined, UserOutlined, UserSwitchOutlined } from '@ant-design/icons'


const { Title } = Typography
const { Content } = Layout

export const AutoRegPage = () => {
  const Segment = [
    {
      label: (
        <div className=' h-[130px] flex flex-col items-center justify-center'>
          <div className="object-conatin w-full h-[60px] mb-3">
            <img className='h-full' src={img1} alt='img'/>
          </div>
          <p style={{ margin: '0 0' }} className='w-[90px] leading-[1.1]'>Новая папка</p>
        </div>
      ),
      value: 'option 1'
    },
    {
      label: (
        <div className=' h-[130px] flex flex-col items-center justify-center'>
          <div className="object-conatin w-full h-[60px] mb-3">
            <img className='h-full' src={img3} alt='img'/>
          </div>
          <p style={{ margin: '0 0' }} className='w-[90px] leading-[1.1]'>Добавить</p>
        </div>
      ),
      value: 'option 2'
    },
    {
      label: (
        <div className=' h-[130px] flex flex-col items-center justify-center'>
          <div className="object-conatin w-full h-[60px] mb-3">
            <img className='h-full' src={img2} alt='img'/>
          </div>
          <p style={{ margin: '0 0' }} className='w-[90px] leading-[1.1]'>Ручной ввод</p>
        </div>
      ),
      value: 'option 3'
    },
  ]

  return (
    <>
      <Layout style={contentStyle}>
        <HeaderComponent title='Авторегистратор'/>

        <Content className='flex gap-8'>
          <MCard className='flex flex-col w-full h-full px-2 py-2 max-w-[800px] z-10'>
            <div className="flex w-full justify-between mb-7">
              <div className="flex flex-col gap-1">
                <Title level={3} style={{ margin: '0 0', fontWeight: 'bold' }}>Установка параметров регистрации</Title>
                <Title level={5} style={{ margin: '0 0', fontWeight: 'normal', color: colors.dopFont }}>Создайте новую папку с аккаунтами или обновите существующую</Title>
              </div>
              <Button danger type='link'>Отменить</Button>
            </div>

            <div className="w-full flex items-center justify-center">
              <Segmented block options={Segment} className='mb-5 w-full'/>
            </div>

            <FolserSelection className='mb-5'/>

            <div className="flex gap-3 mb-5">
              <div className="w-full flex flex-col gap-1">
                <div className="flex gap-2 items-center">
                  <Title level={5} style={{ margin: '0 0' }}>Выбор смс сервиса</Title>
                  <Popover className='cursor-pointer' title="Смс сервис" content='Тут может быть описание смс сервисов'>
                    <InfoCircleOutlined />
                  </Popover>
                </div>
                <Cascader placeholder="Смс сервис" size='large' className='w-full'/>
              </div>
              <div className="w-full flex flex-col gap-1">
                <div className="flex gap-2 items-center">
                  <Title level={5} style={{ margin: '0 0' }}>Выбор оператора</Title>
                  <Popover className='cursor-pointer' title="Оператор" content='Тут может быть описание операторов'>
                    <InfoCircleOutlined />
                  </Popover>
                </div>
                <Cascader placeholder="Оператор" size='large' className='w-full'/>
              </div>
            </div>

            <div className="flex gap-3 mb-5">
              <div className="w-full flex flex-col gap-1">
                <div className="flex gap-2 items-center">
                  <Title level={5} style={{ margin: '0 0' }}>Выбор оператора</Title>
                  <Popover className='cursor-pointer' title="Страна" content='Тут может быть описание выбора стран'>
                    <InfoCircleOutlined />
                  </Popover>
                </div>
                <Cascader placeholder="Страна" size='large' className='w-full'/>
              </div>
              <div className="w-full flex flex-col gap-1">
                <div className="flex gap-2 items-center">
                  <Title level={5} style={{ margin: '0 0' }}>Выбор оператора</Title>
                  <Popover className='cursor-pointer' title="Proxy" content='Тут может быть описание proxy'>
                    <InfoCircleOutlined />
                  </Popover>
                </div>
                <Cascader placeholder="Proxy" size='large' className='w-full'/>
              </div>
            </div>

            <div className="flex gap-3 mb-5">
              <div className="w-[40%] flex flex-col gap-1">
                <div className="flex gap-2 items-center">
                  <Title level={5} style={{ margin: '0 0' }}>Кол-во аккаунтов</Title>
                  <Popover className='cursor-pointer' title="Кол-во аккаунтов" content='Тут может быть описание кол-ва аккаунтов'>
                    <InfoCircleOutlined />
                  </Popover>
                </div>
                <InputNumber size='large' defaultValue={0} min={0} addonBefore={<UserOutlined />} className='w-full' />
              </div>
              <Statistic valueStyle={{ color: colors.primary }} className='w-full' title="Доступно номеров" value={1128} prefix={<UserSwitchOutlined />} />
            </div>

            <div className="w-full flex justify-end">
              <Button icon={<CheckOutlined />} size='large' type='primary'>Зарегестрировать аккаунты</Button>
            </div>
          </MCard>
          <MCard className='w-full'>

          </MCard>
        </Content>
      </Layout>
    </>
  )
}
