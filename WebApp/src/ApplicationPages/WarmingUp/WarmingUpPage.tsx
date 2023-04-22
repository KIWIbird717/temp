import { Typography, Layout, Card } from 'antd'
import { contentStyle } from '../../global-style/layoutStyle'
import { HeaderComponent } from '../../components/HeaderComponent/HeaderComponent'
import { cardStyle } from '../../global-style/layoutStyle'

const { Title } = Typography
const { Content } = Layout

export const WarmingUpPage = () => {

  return (
    <>
      <Layout style={contentStyle}>
        <HeaderComponent title='Прогрев'/>

        <Content>
          <Card bordered={false} style={{ width: '100%', height: '100%', ...cardStyle }}>
            <Title>Прогрев</Title>
          </Card>
        </Content>
      </Layout>
    </>
  )
}
