import React from 'react'
import { Typography, Layout, Card, Breadcrumb, Col, Row } from 'antd'
import { contentStyle, headerStyle } from '../../global-style/layoutStyle'
import { Button } from 'antd'
import { BellOutlined, UserOutlined } from '@ant-design/icons'
import { colors } from '../../global-style/style-colors.module'

const { Title } = Typography
const { Header, Content } = Layout

export const AutoRegPage = () => {
  return (
    <>
      {/* <Header style={headerStyle}>
        <div className='flex w-full h-full items-center justify-start'>
          <Title level={5}>Авторегистратор</Title>
        </div>
      </Header> */}
      <Layout style={contentStyle}>
        <Header style={headerStyle}>
          <Title level={5}>Авторегистратор</Title>
          <div className='flex items-center gap-2'>
            <Button style={{ backgroundColor: colors.white }} icon={<BellOutlined />} size='large' />
            <Button style={{ backgroundColor: colors.white }} icon={<UserOutlined />} size='large' />
            <p>Услуга оплачена</p>
          </div>
        </Header>

        <Content>
          <Card bordered={false} style={{ width: '100%', height: '100%' }}>
            <Title>Авторегистратор</Title>
          </Card>
        </Content>
      </Layout>
    </>
  )
}
