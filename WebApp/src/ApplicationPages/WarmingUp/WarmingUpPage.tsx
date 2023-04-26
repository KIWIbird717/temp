import { Layout, Divider, Button } from 'antd'
import { contentStyle } from '../../global-style/layoutStyle'
import { HeaderComponent } from '../../components/HeaderComponent/HeaderComponent'
import { MCard } from '../../components/Card/MCard'
import { AutoregHeader } from '../Autoreg/AutoregHeader'
import { Groups } from './Groups'
import { Messages } from './Messages'
import { Enterance } from './Enterance'
import { Start } from './Start'

const { Content } = Layout

export const WarmingUpPage = () => {

  return (
    <>
      <Layout style={contentStyle}>
        <HeaderComponent title='Прогрев'/>

        <Content className='flex gap-8'>
          <div className="flex flex-col gap-8 w-full max-w-[1400px] z-1-">
            <MCard className='w-full px-2 py2'>
              <AutoregHeader 
                title='Параметры входа' 
                dopTitle='Задайте пареметры для входа в группы, чаты, каналы' 
              />
              <Enterance />
            </MCard>

            <MCard className='w-full px-2 py2'>
              <AutoregHeader 
                title='Указание сообщений для переписки' 
                dopTitle='Заготовте примеры сообщений для переписки телеграм аккаунтов' 
              />
              <Messages />
            </MCard>

            <MCard className='w-full px-2 py2'>
              <AutoregHeader 
                title='Объекты входа' 
                dopTitle='Установите колличество аккаунтов для начала прогрева' 
              />
              <Start />

              <div className="w-full flex justify-end">
                <Button size='large' type='primary' >Запустить прогрев</Button>
              </div>
            </MCard>
          </div>

          <MCard className='px-2 py-2 w-full max-w-[400px]'>
            <AutoregHeader 
              title='Группы, чаты, каналы' 
              dopTitle='Добавте чаты и группы, для телеграм аккаунтов' 
            />
            <Groups title='Группы'/>
            <Divider />
            <Groups title='Чаты' />
            <Divider />
            <Groups title='Каналы' />
          </MCard>
        </Content>
      </Layout>
    </>
  )
}
