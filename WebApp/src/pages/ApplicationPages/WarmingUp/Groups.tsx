import React, { ReactNode, useState } from 'react'
import { Popover, Typography, Button } from 'antd'
import { DownOutlined, InfoCircleOutlined } from '@ant-design/icons'
import { SliderDriwer, IDataSourceType } from '../../../components/SliderDrawer/SliderDriwer'
import { getRandomDateInCurrentMonth } from '../../../utils/generateTempData'
import { colors } from '../../../global-style/style-colors.module'


const { Title } = Typography

interface IProps {
  title: string,
  icon: ReactNode,
}

export const Groups = ({title, icon}: IProps) => {
  const [groupOpen, seetGroupOpen] = useState<boolean>(true)

  const dummyData: IDataSourceType[] = [
    {
      key: '0',
      title: 'Pro designer',
      avatar: 'https://randomwordgenerator.com/img/picture-generator/52e4d0464c54a414f1dc8460962e33791c3ad6e04e50744075287bd4954cc3_640.jpg',
      date: getRandomDateInCurrentMonth(),
      bots: 5
    },
    {
      key: '1',
      title: 'My chat',
      avatar: 'https://randomwordgenerator.com/img/picture-generator/54e2d7454b54ad14f1dc8460962e33791c3ad6e04e507441722a72d39f4fcc_640.jpg',
      date: getRandomDateInCurrentMonth(),
      bots: 12
    },
    {
      key: '2',
      title: 'Новости today',
      avatar: 'https://randomwordgenerator.com/img/picture-generator/54e5d4444c57af14f1dc8460962e33791c3ad6e04e507441722a72dc924ac5_640.jpg',
      date: getRandomDateInCurrentMonth(),
      bots: 0
    },
    {
      key: '3',
      title: 'ЧП',
      avatar: 'https://randomwordgenerator.com/img/picture-generator/57e6d34b4b56ad14f1dc8460962e33791c3ad6e04e507441722a72d39e4ecc_640.jpg',
      date: getRandomDateInCurrentMonth(),
      bots: 1
    },
    {
      key: '4',
      title: 'My chat2',
      avatar: 'https://randomwordgenerator.com/img/picture-generator/54e2d7454b54ad14f1dc8460962e33791c3ad6e04e507441722a72d39f4fcc_640.jpg',
      date: getRandomDateInCurrentMonth(),
      bots: 3
    },
    {
      key: '5',
      title: 'Новости today2',
      avatar: 'https://randomwordgenerator.com/img/picture-generator/54e5d4444c57af14f1dc8460962e33791c3ad6e04e507441722a72dc924ac5_640.jpg',
      date: getRandomDateInCurrentMonth(),
      bots: 23
    },
    {
      key: '6',
      title: 'ЧП2',
      avatar: 'https://randomwordgenerator.com/img/picture-generator/57e6d34b4b56ad14f1dc8460962e33791c3ad6e04e507441722a72d39e4ecc_640.jpg',
      date: getRandomDateInCurrentMonth(),
      bots: 16
    },
  ]

  return (
    <div className='flex flex-col gap-3'>
      <div className="flex justify-between">
        <div className="flex gap-2 items-center">
          {icon}
          <Title level={5} style={{ margin: '0 0', color: colors.dopFont }}>{title} <span style={{ color: colors.font }}>{`(${dummyData.length})`}</span></Title>
          <Popover className='cursor-pointer' title={title} content={`Добавляйте новые ${title} для телеграм аккаунтов`}>
            <InfoCircleOutlined />
          </Popover>
        </div>
        <Button 
          type='text' 
          style={{ margin: '0 0', padding: '0 9px' }}
          onClick={() => seetGroupOpen(!groupOpen)}
        >
          <DownOutlined />
        </Button>
      </div>

      <SliderDriwer dataSource={dummyData} open={groupOpen}/>
    </div>
  )
}
