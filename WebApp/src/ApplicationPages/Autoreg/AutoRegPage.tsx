import { useState, useRef, useEffect } from 'react'
import { Layout, Segmented } from 'antd'
import { contentStyle } from '../../global-style/layoutStyle'
import { HeaderComponent } from '../../components/HeaderComponent/HeaderComponent'
import { MCard } from '../../components/Card/MCard'
import img1 from '../../images/img1.svg'
import img2 from '../../images/img2.svg'
import img3 from '../../images/img3.svg'
import { AutoregHeader } from './AutoregHeader'
import { NewFolderSettings } from './NewFolderSettings'
import { AnimatePresence, motion } from 'framer-motion'
import { useContainerDimensions } from '../../hooks/useContainerDimention'
import { StaticMessage } from '../../components/StaticMessage/StaticMessage'



const { Content } = Layout

export const AutoRegPage = () => {
  type segmentValueType = number | string
  const [segmentValue, setSegmentValue] = useState<segmentValueType>(0)

  /**@todo remove console.log line*/
  console.log(segmentValue)

  const Segment = [
    {
      key: '1',
      label: (
        <div className=' h-[130px] flex flex-col items-center justify-center'>
          <div className="object-conatin w-full h-[60px] mb-3">
            <img className='h-full' src={img1} alt='img'/>
          </div>
          <p style={{ margin: '0 0' }} className='w-[90px] leading-[1.1]'>Новая папка</p>
        </div>
      ),
      value: 0
    },
    {
      key: '2',
      label: (
        <div className=' h-[130px] flex flex-col items-center justify-center'>
          <div className="object-conatin w-full h-[60px] mb-3">
            <img className='h-full' src={img3} alt='img'/>
          </div>
          <p style={{ margin: '0 0' }} className='w-[90px] leading-[1.1]'>Добавить</p>
        </div>
      ),
      value: 1
    },
    {
      key: '3',
      label: (
        <div className=' h-[130px] flex flex-col items-center justify-center'>
          <div className="object-conatin w-full h-[60px] mb-3">
            <img className='h-full' src={img2} alt='img'/>
          </div>
          <p style={{ margin: '0 0' }} className='w-[90px] leading-[1.1]'>Ручной ввод</p>
        </div>
      ),
      value: 2
    },
  ]

  const container = useRef<HTMLInputElement>(null)
  const mainCard = useRef<HTMLInputElement>(null)

  const { width } = useContainerDimensions(container)
  const { height } = useContainerDimensions(mainCard)

  return (
    <>
      <Layout style={contentStyle}>
        <HeaderComponent title='Авторегистратор'/>

        <Content className='flex gap-8'>
          <MCard className='px-2 py-2 w-full max-w-[800px] z-10'>
            <AutoregHeader 
              title='Установка параметров регистрации' 
              dopTitle='Создайте новую папку с аккаунтами или обновите существующую' 
            />
            <div ref={mainCard} className="flex flex-col">
              <div className="w-full flex items-center justify-center">
                <Segmented value={segmentValue} onChange={setSegmentValue} block options={Segment} className='mb-5 w-full'/>
              </div>
              <div ref={container} className="flex overflow-hidden">
                <AnimatePresence>
                  <motion.div
                    animate={{
                      x: -segmentValue * width,
                      transition: {type: "spring", bounce: 0.1, duration: 0.6}
                    }}
                    className='w-full flex'
                  >
                    <NewFolderSettings key={0} current={0} value={segmentValue} />
                    <NewFolderSettings key={1} current={1} value={segmentValue} />
                    <NewFolderSettings key={2} current={2} value={segmentValue} />
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </MCard>

          <MCard className='px-2 py-2 w-full max-w-[800px]'>
            <AutoregHeader 
              title='Недавние действия' 
              dopTitle='Последняя информация об аккаунтах' 
            />
            <div style={{ height: height }} className="flex flex-col gap-3 overflow-y-scroll overflow-x-hidden pr-[5px]">
              <StaticMessage 
                title='Добавление аккаунтов'
                dopTitle='Успешно добавлено 50 аккаунтов в новую папку'
                type='success'
                date='12 апреля, 2023'
              />
              <StaticMessage 
                title='Добавление аккаунтов'
                dopTitle='Успешно добавлено 50 аккаунтов в новую папку'
                type='success'
                date='12 апреля, 2023'
              />
              <StaticMessage 
                title='Добавление аккаунтов'
                dopTitle='Успешно добавлено 50 аккаунтов в новую папку'
                type='warning'
                date='12 апреля, 2023'
              />
              <StaticMessage 
                title='Добавление аккаунтов'
                dopTitle='Успешно добавлено 50 аккаунтов в новую папку'
                type='error'
                date='12 апреля, 2023'
              />
              <StaticMessage 
                title='Добавление аккаунтов'
                dopTitle='Успешно добавлено 50 аккаунтов в новую папку'
                type='error'
                date='12 апреля, 2023'
              />
              <StaticMessage 
                title='Добавление аккаунтов'
                dopTitle='Успешно добавлено 50 аккаунтов в новую папку'
                type='error'
                date='12 апреля, 2023'
              />
            </div>
          </MCard>
        </Content>
      </Layout>
    </>
  )
}
