import { useRef } from 'react'
import { Typography, Layout, List, Input, Button, message } from 'antd'
import { contentStyle } from '../../../global-style/layoutStyle'
import { HeaderComponent } from '../../../components/HeaderComponent/HeaderComponent'
import { MCard } from '../../../components/Card/MCard'
import { useContainerDimensions } from '../../../hooks/useContainerDimention'
import { SelectOptions } from './SelectOptions'
import { formatDate } from '../../../utils/formatDate'
import { MSearch } from '../../../components/Search/MSearch'
import styles from '../../../global-style/scroll-bar-style.module.css'
import tStyles from './styles.module.css'
import { DownloadOutlined } from '@ant-design/icons'

const { Content } = Layout
const { Title } = Typography

export const LogsPage = () => {
  const headerRef = useRef<HTMLInputElement>(null)
  const { height } = useContainerDimensions(headerRef)
  const globalPadding = Number((contentStyle.padding as string).slice(4,6))

  const data = [
    'Racing car sprays burning fuel into crowd.',
    'Japanese princess to wed commoner.',
    'Australian walks 100km after outback crash.',
    'Man charged over missing wedding girl.',
    'Los Angeles battles huge wildfires.',
    'Racing car sprays burning fuel into crowd.',
    'Japanese princess to wed commoner.',
    'Australian walks 100km after outback crash.',
    'Man charged over missing wedding girl.',
    'Los Angeles battles huge wildfires.',
    'Racing car sprays burning fuel into crowd.',
    'Japanese princess to wed commoner.',
    'Australian walks 100km after outback crash.',
    'Man charged over missing wedding girl.',
    'Los Angeles battles huge wildfires.',
    'Racing car sprays burning fuel into crowd.',
    'Japanese princess to wed commoner.',
    'Australian walks 100km after outback crash.',
    'Man charged over missing wedding girl.',
    'Los Angeles battles huge wildfires.',
    'Racing car sprays burning fuel into crowd.',
    'Japanese princess to wed commoner.',
    'Australian walks 100km after outback crash.',
    'Man charged over missing wedding girl.',
    'Los Angeles battles huge wildfires.',
    'Racing car sprays burning fuel into crowd.',
    'Japanese princess to wed commoner.',
    'Australian walks 100km after outback crash.',
    'Man charged over missing wedding girl.',
    'Los Angeles battles huge wildfires.',
  ]

  const onSearch = (value: string) => {
    console.log(value)
  }

  const tempDate = formatDate(new Date)

  return (
    <>
      <Layout style={contentStyle}>
        <div ref={headerRef}>
          <HeaderComponent title='Логи'/>
        </div>

        <Content>
          <MCard className='px-2 py-2'>
          <div className='flex justify-between'>
            <div className="mb-7 flex gap-3">
              <MSearch
                placeholder="Поиск по логам"
                allowClear
                enterButton="Search"
                size="large"
                onSearch={onSearch}
              />
              <SelectOptions />
            </div>
            <Button 
              className='border-[0px] shadow-md' 
              size='large' 
              shape="circle" 
              icon={<DownloadOutlined />} 
              onClick={() => message.success('Логи скачаны в папку Загрузки')} 
            />
          </div>
          <div 
            style={{ maxHeight: `calc(100vh - ${height + globalPadding + 140}px)` }} 
            className={`w-full overflow-y-scroll overflow-x-hidden mr-8 ${styles.scroll_bar_style}`}
          >
            <List
              bordered
              dataSource={data}
              renderItem={(item) => (
                <List.Item>
                  <div className='w-full flex justify-between'>
                    <div className="div">
                      <Typography.Text mark>[MSG]</Typography.Text> {item}
                    </div>
                    {tempDate}
                  </div>
                </List.Item>
              )}
            />
          </div>
          </MCard>
        </Content>
      </Layout>
    </>
  )
}
