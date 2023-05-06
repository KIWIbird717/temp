import { 
  Button, 
  Cascader, 
  Input, 
  Popover, 
  Space, 
  Typography, 
  Upload, 
  message 
} from 'antd'
import { CheckOutlined, FolderOpenFilled, FolderOpenOutlined, InfoCircleOutlined, LoadingOutlined, PlusOutlined, UserOutlined } from '@ant-design/icons'
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
import { RcFile, UploadChangeParam, UploadFile, UploadProps } from 'antd/es/upload'


const { Title } = Typography

type propsType = {
  key: number | string,
  current: number | string,
  value: number | string,
}

const getBase64 = (img: RcFile, callback: (url: string) => void) => {
  const reader = new FileReader()
  reader.addEventListener('load', () => callback(reader.result as string))
  reader.readAsDataURL(img)
}

const beforeUpload = (file: RcFile) => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
  if (!isJpgOrPng) {
    message.error('You can only upload JPG/PNG file!')
  }
  const isLt2M = file.size / 1024 / 1024 < 2
  if (!isLt2M) {
    message.error('Image must smaller than 2MB!')
  }
  return isJpgOrPng && isLt2M
}

export const ManualSettings = ({key, current, value}: propsType) => {
  const accaountsFolders: IHeaderType[] | null = useSelector((state: StoreState) => state.user.userManagerFolders)
  const [modal, setModal] = useState<boolean>(false)
  const [selectedFolder, setSelectedFolder] = useState<null | IHeaderType>(null)

  const [loading, setLoading] = useState(false)
  const [imageUrl, setImageUrl] = useState<string>()

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Загрузить</div>
    </div>
  )

  const handleAvatarChange: UploadProps['onChange'] = (info: UploadChangeParam<UploadFile>) => {
    if (info.file.status === 'uploading') {
      setLoading(true);
      return
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj as RcFile, (url) => {
        setLoading(false)
        setImageUrl(url)
      })
    }
  }

  return (
    <motion.div 
      className='min-w-full'
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

      <div className="flex flex-col justify-between">
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

          <div className="flex gap-3 mb-5 items-start">
            <div className="flex gap-3 flex-col w-full">
              <div className="flex gap-2 items-center">
                <Title level={5} style={{ margin: '0 0' }}>Профиль</Title>
                <Popover className='cursor-pointer' title="Профиль" content='Добавьте описание для Телеграм профиля'>
                  <InfoCircleOutlined />
                </Popover>
              </div>
              <div className="flex gap-3 items-center w-[fit-content]">
                <Upload
                  name="avatar"
                  listType="picture-circle"
                  showUploadList={false}
                  // action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                  beforeUpload={beforeUpload}
                  onChange={handleAvatarChange}
                  className={styles.avatar_uploader}
                >
                  {imageUrl ? <img src={imageUrl} alt="avatar" /> : uploadButton}
                </Upload>
                <div className="flex flex-col gap-2">
                  <Input size="large" placeholder="Имя" />
                  <Input size="large" placeholder="Фамилия" />
                </div>
              </div>
            </div>

            <div className="w-full flex flex-col gap-1">
              <div className="flex gap-2 items-center">
                <Title level={5} style={{ margin: '0 0' }}>BIO</Title>
                <Popover className='cursor-pointer' title="BIO" content='Добавьте BIO для профиля'>
                  <InfoCircleOutlined />
                </Popover>
              </div>
              <div className="flex flex-col gap-7">
                <Input size="large" placeholder="BIO" />
                <Input size="large" placeholder="Имя пользователя" prefix='@' />
              </div>
            </div>
          </div> 

          <div className="flex gap-3 mb-5 items-center">
            <div className="w-full flex flex-col gap-1">
              <div className="flex gap-2 items-center">
                <Title level={5} style={{ margin: '0 0' }}>Номер телефона</Title>
                <Popover className='cursor-pointer' title="Номер телефона" content='Добавьте номер телефона Телеграм аккаунта'>
                  <InfoCircleOutlined />
                </Popover>
              </div>
              {/* <Input size="large" placeholder="Номер телефона" /> */}
              <Space.Compact size="large">
                <Input size="large" style={{ width: '18%' }} defaultValue="+7" />
                <Input size="large" style={{ width: '82%' }} placeholder='Номер телефона' />
              </Space.Compact>
            </div>
            <div className="w-full flex flex-col gap-1">
              <div className="flex gap-2 items-center">
                <Title level={5} style={{ margin: '0 0' }}>Proxy</Title>
                <Popover className='cursor-pointer' title="Proxy" content='Тут может быть описание proxy'>
                  <InfoCircleOutlined />
                </Popover>
              </div>
              <Cascader placeholder="Proxy" size='large' className='w-full'/>
            </div>
          </div>
        </div>

        <div className="w-full flex justify-between items-center">
          <Button danger type='link'>Отменить</Button>
          <Button icon={<CheckOutlined />} size='large' type='primary'>Добавить аккаунт</Button>
        </div>
      </div>
    </motion.div>
  )
}
