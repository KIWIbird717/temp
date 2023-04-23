import { Typography, Layout } from 'antd'
import { contentStyle } from '../../global-style/layoutStyle'
import { HeaderComponent } from '../../components/HeaderComponent/HeaderComponent'
import { MCard } from '../../components/Card/MCard'

const { Title } = Typography
const { Content } = Layout

export const ProxyManagerPage = () => {

  return (
    <>
      <Layout style={contentStyle}>
        <HeaderComponent title='Менеждер proxy'/>

        <Content>
          <MCard className='w-full h-full' >
            <Title>Менеждер proxy</Title>
          </MCard>
        </Content>
      </Layout>
    </>
  )
}
