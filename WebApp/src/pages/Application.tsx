import React, { useEffect } from 'react'
import { Layout, Space } from 'antd'
import { SiderComponent } from '../components/SiderComponent/SiderComponent'
import { siderStyle } from '../global-style/layoutStyle'
import { motion } from "framer-motion"
import { IRootStoreState } from '../store/types';
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import { RouterPages } from './ApplicationPages/RouterPages'

const { Sider } = Layout

export const Application = () => {
  const siderWidth: number = 250
  const isUserLogined = useSelector((state: IRootStoreState) => state.user.isUserLogined)

  const navigate = useNavigate()

  // Check if user not signed in
  useEffect(() => {
    if (!isUserLogined) navigate('/')
  }, [isUserLogined])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.1, duration: 0.2 }}
    >
      <Space direction="vertical" style={{ width: '100%' }} size={[0, 48]}>
        <Layout>
          <Sider style={siderStyle} width={siderWidth} collapsible={false}>
            <SiderComponent />
          </Sider>
          
          <RouterPages />
        </Layout>
      </Space>
    </motion.div>
  )
}
