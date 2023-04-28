import { useRef } from 'react'
import { Typography, Layout, List, Input } from 'antd'
import { contentStyle } from '../../../global-style/layoutStyle'
import { HeaderComponent } from '../../../components/HeaderComponent/HeaderComponent'
import { MCard } from '../../../components/Card/MCard'
import { useContainerDimensions } from '../../../hooks/useContainerDimention'
import { SelectOptions } from './SelectOptions'
import { formatDate } from '../../../utils/formatDate'

const { Content } = Layout
const { Search } = Input

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
          <div className='mb-7 flex gap-3'>
            <SelectOptions />
            <Search
              placeholder="Поиск по логам"
              allowClear
              enterButton="Search"
              size="large"
              onSearch={onSearch}
              className='max-w-[300px]'
            />
          </div>
          <div style={{ maxHeight: `calc(100vh - ${height + globalPadding + 140}px)` }} className='w-full overflow-y-scroll overflow-x-hidden'>
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
