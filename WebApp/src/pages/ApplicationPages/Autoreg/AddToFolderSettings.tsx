import { Button, Cascader, InputNumber, Statistic, Popover, Typography } from 'antd'
import { CheckOutlined, FolderOpenFilled, FolderOpenOutlined, InfoCircleOutlined, UserOutlined, UserSwitchOutlined } from '@ant-design/icons'
import { colors } from '../../../global-style/style-colors.module'
import { motion } from 'framer-motion'
import { Modal } from 'antd'
import { useState } from 'react'
import { useSelector } from 'react-redux'  
import { StoreState } from '../../../store/store'
import tableCard from '../../../images/tableCard.svg'
import { SliderDriwer } from '../../../components/SliderDrawer/SliderDriwer'
import styles from './folder-selection-style.module.css'
import { IHeaderType } from '../AccountsManager/Collumns'

const { Title } = Typography

type propsType = {
  key: number | string,
  current: number | string,
  value: number | string,
}

export const AddToFolderSettings = ({key, current, value}: propsType) => {
  const accaountsFolders: IHeaderType[] | null = useSelector((state: StoreState) => state.user.userManagerFolders)
  const [modal, setModal] = useState<boolean>(false)
  const [selectedFolder, setSelectedFolder] = useState<null | IHeaderType>(null)


  return (
    <motion.div 
      className='min-w-full flex flex-col justify-between'
      initial={value === current ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
      animate={value === current ? { opacity: 1, scale: 1 } : 'null'}
      transition={{ duration: 0.2 }}
    >
      <Modal style={{ borderRadius: 20 }} title="Выбор папку с аккаунтами" open={modal} onOk={() => setModal(false)} onCancel={() => setModal(false)}>
        <div className="flex flex-col gap-3 my-5">
          <SliderDriwer 
            dataSource={accaountsFolders || []}
            open={true}
            visibleAmount={3}
            render={(el) => (
              <div 
                key={el.key} 
                className={`${styles.slider_driwer_folder} flex justify-between w-full rounded-2xl p-3 bg-white`}
                onClick={() => {setSelectedFolder(el); setModal(false)}}
              >
                <div className="flex items-center gap-5">
                  <div className='h-[110px] object-contain'>
                    <img className='w-full h-full' src={tableCard} alt='icon'/>
                  </div>
                  <div className="flex flex-col gap-1">
                    <Title style={{ margin: '0px 0px' }} level={4}>{el.folder}</Title>
                    <Title style={{ margin: '0px 0px', fontWeight: '400' }} type='secondary' level={5}>{el.dopTitle}</Title>
                    <div className="flex gap-1 items-start">
                      <Title className='m-0' level={5}>{el.accountsAmount}</Title>
                      <UserOutlined className='my-1 mt-[5px]' />
                    </div>
                  </div>
                </div>
              </div>
            )}
          />
        </div>
      </Modal>
      <div>
        {selectedFolder ? (
          <motion.div 
            className="flex justify-between items-center"
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className='flex items-center gap-3 w-full mb-5'>
              <div className="object-contain h-[130px]">
                <img className='h-full' src={tableCard} alt='table card'/>
              </div>
              <div className="flex flex-col gap-3 w-full">
                <Title 
                  level={3} 
                  style={{ margin: '0px 0px', width: '100%' }}
                  className={styles.folder_styles}
                >
                  {selectedFolder.folder}
                </Title>
                <Title 
                  level={5} 
                  style={{margin: '5px 5px', fontWeight: 'normal', width: '100%', color: colors.dopFont}}
                >
                  {selectedFolder.dopTitle}
                </Title>
              </div>
            </div>
            <Button className='mr-5' icon={<FolderOpenOutlined />} onClick={() => setModal(true)}>Изменить</Button>
          </motion.div>
          ) : (
          <div className='flex items-center gap-3 w-full mb-5'>
            <Button onClick={() => setModal(true)} type='dashed' className='w-[160px] h-[120px]'>
              <FolderOpenFilled style={{ fontSize: 50 }} />
            </Button>
            <Title level={3} style={{ margin: 0 }}>Выберите папку</Title>
          </div>
        )}

      <div className="w-full flex gap-3 mb-5">
        <div className="w-full flex flex-col gap-1">
          <div className="flex gap-2 items-center">
            <Title level={5} style={{ margin: '0 0' }}>Выбор смс сервиса</Title>
            <Popover className='cursor-pointer' title="Смс сервис" content='Тут может быть описание смс сервисов'>
              <InfoCircleOutlined />
            </Popover>
          </div>
          <Cascader placeholder="Смс сервис" size='large' className='w-full'/>
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
        <div className="w-full flex justify-between gap-3 mb-7">
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
