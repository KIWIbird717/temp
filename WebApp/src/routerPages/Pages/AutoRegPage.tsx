import React from 'react'
import { Typography, Layout } from 'antd'
import { headerStyle, contentStyle } from '../../global-style/layoutStyle'

const { Title } = Typography
const { Header, Content } = Layout

export const AutoRegPage = () => {
  return (
    <>
      <Header style={headerStyle}>
        <div className='flex w-full h-full items-center justify-start'>
          <Title level={5}>Авторегистратор</Title>
        </div>
      </Header>
      <Content style={contentStyle}>
        <Title>Авторегистратор</Title>
      </Content>
    </>
  )
}
