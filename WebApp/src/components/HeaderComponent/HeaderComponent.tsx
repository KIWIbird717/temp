import { Header } from 'antd/es/layout/layout'
import { Typography, Button } from 'antd'
import { colors } from '../../global-style/style-colors.module'
import { BellOutlined, UserOutlined } from '@ant-design/icons'
import { headerStyle } from '../../global-style/layoutStyle'
import { useSelector } from 'react-redux'
import { StoreState } from '../../store/store'
import { motion } from 'framer-motion'

type propsType = {
  title: string
}

/**
 *  Header component for application
 * @prop title
 */
export const HeaderComponent = ({title}: propsType) => {
  const { Title } = Typography
  const userNickName = useSelector((state: StoreState) => state.user.nick)

  return (
    <Header style={ headerStyle }>
      <div className='w-full h-full flex items-center justify-between'>
        <motion.div className='flex flex-col items-start gap-1'>
          <Title style={{ margin: '0px 0px' }} level={5}>Здравствуйте, {userNickName}</Title>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Title style={{ margin: '0px 0px', fontWeight: 'bold' }} level={1}>{title}</Title>
          </motion.div>
        </motion.div>
        <div className='flex items-center gap-2'>
          <Button style={{ backgroundColor: colors.white }} icon={<BellOutlined />} size='large' />
          <Button style={{ backgroundColor: colors.white }} icon={<UserOutlined />} size='large' />
          <p>Услуга оплачена</p>
        </div>
      </div>
    </Header>
  )
}
