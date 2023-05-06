import { Button, Cascader, InputNumber, Statistic, Popover, Typography, Select } from 'antd'
import { FolserSelection } from './FolserSelection'
import { CheckOutlined, InfoCircleOutlined, UserOutlined, UserSwitchOutlined } from '@ant-design/icons'
import { colors } from '../../../global-style/style-colors.module'
import { motion } from 'framer-motion'
import { useSelector } from 'react-redux'
import { StoreState } from '../../../store/store'
import { smsServicesTypes } from '../../../store/types'
import { useEffect, useState } from 'react'
import { DefaultOptionType } from 'antd/es/select'

const { Title } = Typography

type propsType = {
  key: number | string,
  current: number | string,
  value: number | string,
}

export const NewFolderSettings = ({key, current, value}: propsType) => {
  const smsServisiesRaw = useSelector((state: StoreState) => state.app.smsServisies)
  const [smsServisies, setSmsServisies] = useState<DefaultOptionType[] | null>(null)
  
  useEffect(() => {
    const smsServisies = smsServisiesRaw?.map((el: smsServicesTypes) => ({value: el.title, label: el.title})) || null
    setSmsServisies(smsServisies)
  }, [smsServisiesRaw])

  return (
    <motion.div 
      className='min-w-full flex flex-col justify-between'
      initial={value === current ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
      animate={value === current ? { opacity: 1, scale: 1 } : 'null'}
      transition={{ duration: 0.2 }}
    >
      <div>
      <FolserSelection className='mb-5'/>

      <div className="w-full flex gap-3 mb-5">
        <div className="w-full flex flex-col gap-1">
          <div className="flex gap-2 items-center">
            <Title level={5} style={{ margin: '0 0' }}>Выбор смс сервиса</Title>
            <Popover className='cursor-pointer' title="Смс сервис" content='Тут может быть описание смс сервисов'>
              <InfoCircleOutlined />
            </Popover>
          </div>
          <Select 
            placeholder="Смс сервис" 
            size='large' 
            className='w-full'
            options={smsServisies ? smsServisies : []}
            dropdownMatchSelectWidth={false}
            allowClear
          />
        </div>
        <div className="w-full flex flex-col gap-1">
          <div className="flex gap-2 items-center">
            <Title level={5} style={{ margin: '0 0' }}>Выбор страны</Title>
            <Popover className='cursor-pointer' title="Страна" content='Тут может быть описание выбора стран'>
              <InfoCircleOutlined />
            </Popover>
          </div>
          <Cascader placeholder="Страна" size='large' className='w-full'/>
        </div>
      </div>

      <div className="flex gap-3 mb-5">
        <div className="w-full flex flex-col gap-1">
          <div className="flex gap-2 items-center">
            <Title level={5} style={{ margin: '0 0' }}>Proxy</Title>
            <Popover className='cursor-pointer' title="Proxy" content='Тут может быть описание proxy'>
              <InfoCircleOutlined />
            </Popover>
          </div>
          <Cascader placeholder="Proxy" size='large' className='w-full'/>
        </div>
        <div className="w-full flex gap-3 mb-7">
          <div className="w-full flex flex-col gap-1">
            <div className="flex gap-2 items-center">
              <Title level={5} style={{ margin: '0 0' }}>Кол-во аккаунтов</Title>
              <Popover className='cursor-pointer' title="Кол-во аккаунтов" content='Тут может быть описание кол-ва аккаунтов'>
                <InfoCircleOutlined />
              </Popover>
            </div>
            <InputNumber size='large' defaultValue={0} min={0} addonBefore={<UserOutlined />} className='w-full' />
          </div>
          <Statistic valueStyle={{ color: colors.primary }} className='w-full' title="Доступно номеров" value={1128} prefix={<UserSwitchOutlined />} />
        </div>
      </div>
      </div>

      <div className="w-full flex justify-between items-center">
        <Button danger type='link'>Отменить</Button>
        <Button icon={<CheckOutlined />} size='large' type='primary'>Зарегестрировать аккаунты</Button>
      </div>
    </motion.div>
  )
}
