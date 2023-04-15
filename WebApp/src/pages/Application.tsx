import React from 'react'
import { Layout, Space } from 'antd'
import { SiderComponent } from '../components/Sider/SiderComponent'
import { siderStyle } from '../global-style/layoutStyle'

import { RouterPages } from '../routerPages/RouterPages'

const { Sider } = Layout

export const Application = () => {
  const siderWidth: number = 250

  return (
    <Space direction="vertical" style={{ width: '100%' }} size={[0, 48]}>
      <Layout>
        <Sider style={siderStyle} width={siderWidth} collapsible={false}>
          <SiderComponent />
        </Sider>
        <Layout>
          <RouterPages />
        </Layout>
      </Layout>
    </Space>
  )
}
