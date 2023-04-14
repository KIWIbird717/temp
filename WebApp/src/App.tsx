import React from 'react'
import { Layout, Space, Typography } from 'antd';
import { colors } from './global-style/style-colors.module';
import { SiderComponent } from './components/Sider/SiderComponent';

const { Header, Sider, Content } = Layout
const { Title } = Typography

const App: React.FC = () => {
  const siderWidth: number = 250

  return (
    <Space direction="vertical" style={{ width: '100%' }} size={[0, 48]}>
      <Layout>
        <Sider style={siderStyle} width={siderWidth} collapsible={false}>
          <SiderComponent />
        </Sider>
        <Layout>
          <Header style={headerStyle}>Header</Header>
          <Content style={contentStyle}>
            <Title>Тут будет контент</Title>
          </Content>
        </Layout>
      </Layout>
    </Space>
  )
}

const headerStyleHeight: number = 64

const siderStyle: React.CSSProperties = {
  lineHeight: '120px',
  color: '#fff',
  backgroundColor: colors.white,
  padding: '0 20px'
}

const headerStyle: React.CSSProperties = {
  textAlign: 'center',
  color: '#000',
  height: headerStyleHeight,
  paddingInline: 50,
  lineHeight: '64px',
  backgroundColor: colors.background,
}

const contentStyle: React.CSSProperties = {
  minHeight: `calc(100vh - ${headerStyleHeight}px)`,
  lineHeight: '120px',
  color: '#000',
  backgroundColor: colors.background,
}


export default App;
