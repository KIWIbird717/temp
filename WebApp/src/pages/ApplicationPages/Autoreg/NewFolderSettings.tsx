import { Button, Cascader, InputNumber, Statistic, Popover, Typography, Select, ConfigProvider, Spin } from 'antd'
import { FolserSelection } from './FolserSelection'
import { CheckOutlined, InfoCircleOutlined, UserOutlined, UserSwitchOutlined } from '@ant-design/icons'
import { colors } from '../../../global-style/style-colors.module'
import { motion } from 'framer-motion'
import { useSelector } from 'react-redux'
import { StoreState } from '../../../store/store'
import { smsServicesTypes, smsServiciesDataType } from '../../../store/types'
import { useEffect, useState } from 'react'
import { DefaultOptionType } from 'antd/es/select'
import type { SelectProps } from 'antd';
import { NoDataCountries, ServiceIsNotSelected } from '../../../components/CustomNoData/NoDataCountries'
import axios from 'axios'
import { IProxyHeaderType } from '../ProxyManager/Collumns'

const { Title } = Typography

type propsType = {
  current: number | string,
  value: number | string,
}

interface IProxyClearData {
  value: string,
  label: string,
  children: {value: string | number, label: string}[]
}

const getAvaliablePhones = async (service: string | null, countryId: string | null): Promise<any> => {
  if (!service && !countryId) return null

  try {
    const avaliablePhones = await axios.get(`${process.env.REACT_APP_SERVER_END_POINT}/telegram/get-available-phones?service=${service}&countryId=${countryId}`)
    return avaliablePhones
  } catch (err) {
    console.error(err)
    return null
  }
}

export const NewFolderSettings = ({current, value}: propsType) => {
  // SMS servicies
  const smsServicies = useSelector((state: StoreState) => state.app.smsServiciesData)
  const smsServiciesData = smsServicies?.filter((service: smsServiciesDataType) => service.countries?.length)

  // Proxies
  const proxiesRawData = useSelector((state: StoreState) => state.user.userProxyFolders)
  const [proxyClearData, setProxyClearData] = useState<IProxyClearData[] | null>(null)

  const [avaliablePhonesLoading, setAvaliablePhonesLoading] = useState<boolean>(false)

  const [smsServisies, setSmsServisies] = useState<DefaultOptionType[] | null>(null)
  const [avaliableCountries, setAvaliableCountries] = useState<SelectProps[]>([])
  const [avaliablePhones, setAvaliablePhones] = useState<{cost: number, count: number} | null>(null) // Avaliable phones data

  const [selectedSmsService, setSelectedSmsService] = useState<string | null>(null)
  const [selectedCountry, setSelectedCountry] = useState<{label: string, value: string} | null>(null)
  const [selectedProxy, setSelectedProxy] = useState<(string | number)[] | null>(null)

  const upDateFields = (): void => {
    setSelectedCountry(null)
    setAvaliableCountries([])
    setAvaliablePhones(null)
  }

  const resetFields = () => {
    setSelectedSmsService(null)
    setSelectedCountry(null)
    setAvaliableCountries([])
    setAvaliablePhones(null)
    setSelectedProxy(null)
  }

  // Set proxy clear data
  useEffect(() => {
    const proxies = proxiesRawData?.map((proxy: IProxyHeaderType) => {
      const proxyTableData = proxy.proxies.map((proxyData) => {
        return (
          {
            value: proxyData.key,
            label: proxyData.login
          }
        )
      })
      return (
        {
          value: proxy.folder, 
          label: proxy.folder,
          children: [
            ...proxyTableData
          ]
        }
      )
    })
    setProxyClearData(proxies || null)
  }, [proxiesRawData])
  
  // Paste clear data to sms servicies
  useEffect(() => {
    const smsServisies = smsServiciesData?.map((el: smsServicesTypes) => ({value: el.title, label: el.title})) || null
    setSmsServisies(smsServisies)
  }, [smsServicies])

  // Parce avaliable countries
  useEffect(() => {
    const selectCountriesList = smsServiciesData?.find((service) => service.title === selectedSmsService)
    const countiesDebounceSelect = selectCountriesList?.countries?.map((country) => {
      return { label: country.name, value: country.id }
    })
    setAvaliableCountries(countiesDebounceSelect || [])
  }, [selectedSmsService])

  // Parse avaliable phones
  useEffect(() => {
    setAvaliablePhonesLoading(true)
    if (selectedCountry?.label && selectedCountry?.value) {
      getAvaliablePhones(selectedSmsService, selectedCountry?.value)
        .then((data) => {
          if (data) {
            setAvaliablePhones(data.data.telegram)
          } else {
            setAvaliablePhones(data) // null
          }
        })
    }
    setAvaliablePhonesLoading(false)
  }, [selectedCountry])

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
            value={selectedSmsService}
            onClear={() => {
              upDateFields()
              setAvaliableCountries([])
              setSelectedSmsService(null)
            }}
            onSelect={(service) => {
              upDateFields()
              setSelectedSmsService(service)
            }}
          />
        </div>
        <div className="w-full flex flex-col gap-1">
          <div className="flex gap-2 items-center">
            <Title level={5} style={{ margin: '0 0' }}>Выбор страны</Title>
            <Popover className='cursor-pointer' title="Страна" content='Тут может быть описание выбора стран'>
              <InfoCircleOutlined />
            </Popover>
          </div>
          <ConfigProvider renderEmpty={avaliableCountries.length ? NoDataCountries : ServiceIsNotSelected}>
            <Select
              size='large'
              showSearch
              placeholder='Страна'
              optionFilterProp="children"
              filterOption={(input, option) => ((option as {label: string, value: string})?.label.toLowerCase() ?? '').includes(input)}
              filterSort={(optionA, optionB) =>
                ((optionA as {label: string, value: string})?.label ?? '').toLowerCase().localeCompare(((optionB as {label: string, value: string})?.label ?? '').toLowerCase())
              }
              // mode="tags"
              value={selectedCountry?.label}
              style={{ width: '100%' }}
              onChange={(_, countryData) => {setSelectedCountry(countryData as {label: string, value: string})}}
              tokenSeparators={[',']}
              options={avaliableCountries || []}
            />
          </ConfigProvider>
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
          <Cascader 
            placeholder="Proxy" 
            size='large' 
            className='w-full'
            options={proxyClearData || []}
            value={selectedProxy || undefined}
            onChange={setSelectedProxy}
          />
        </div>
        <div className="w-full flex gap-3 mb-7">
          <div className="w-full flex flex-col gap-1">
            <div className="flex gap-2 items-center">
              <Title level={5} style={{ margin: '0 0' }}>Кол-во аккаунтов</Title>
              <Popover className='cursor-pointer' title="Кол-во аккаунтов" content='Тут может быть описание кол-ва аккаунтов'>
                <InfoCircleOutlined />
              </Popover>
            </div>
            <InputNumber 
              size='large' 
              defaultValue={0} 
              min={0} 
              max={avaliablePhones?.count !== undefined ? avaliablePhones?.count : 0} 
              addonBefore={<UserOutlined />} 
              className='w-full' 
            />
          </div>
          {avaliablePhonesLoading ? (
            <Statistic 
              valueStyle={{ color: colors.primary }} 
              className='w-full' 
              title="Доступно номеров" 
              value={' '}
              prefix={ <div><UserSwitchOutlined /> <Spin/> </div>} 
            />
          ) : (
            <Statistic 
              valueStyle={{ color: colors.primary }} 
              className='w-full' 
              title="Доступно номеров" 
              value={avaliablePhones?.count !== undefined ? avaliablePhones?.count : '-'} 
              prefix={ <UserSwitchOutlined />} 
            />
          )}
        </div>
      </div>
      </div>

      <div className="w-full flex justify-between items-center">
        {selectedSmsService || selectedCountry || selectedProxy ? (
          <Button danger type='link' onClick={() => resetFields()}>Отменить</Button>
        ) : (
          <div></div>
        )}
        <Button icon={<CheckOutlined />} size='large' type='primary'>Зарегестрировать аккаунты</Button>
      </div>
    </motion.div>
  )
}
