import { useState, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Avatar, Button, Typography } from 'antd'
import { BugTwoTone, LeftOutlined, RightOutlined } from '@ant-design/icons'
import { getastSeenMessage } from '../../utils/getLastSeenMessage'
import { divideArrayIntoGroups } from '../../utils/divideArrayIntoGroups'
import type { ArrayIntoGroupsType } from '../../utils/divideArrayIntoGroups'
import { useContainerDimensions } from '../../hooks/useContainerDimention'
import { colors } from '../../global-style/style-colors.module'


const { Title } = Typography

interface IProps {
  dataSource: IDataSourceType[],
  open: boolean
}

export interface IDataSourceType {
  key: React.Key,
  avatar: string,
  title: string,
  date: Date,
  bots: number
}

/**
 * Responsive component.
 * Contains chats, groups and chanel in WarmingUp page
 */
export const SliderDriwer = ({dataSource, open}: IProps) => {
  const [data, setData] = useState<ArrayIntoGroupsType<IDataSourceType>>(divideArrayIntoGroups(dataSource, 4))
  const [slide, setSlide] = useState<number>(0)

  const groupsPars = useRef<HTMLInputElement>(null)
  const { width } = useContainerDimensions(groupsPars)

  const slideLeft = () => {
    if (slide < 1) {
      setSlide(0)
    } else {
      setSlide(slide - 1)
    }
  }
  const slideRight = () => {
    if (slide > data.length - 2) {
      setSlide(slide)
    } else {
      setSlide(slide + 1)
    }
  }

  return (
    <AnimatePresence>
      <motion.div 
        className="flex flex-col gap-2" 
        style={{ height: open ? '100%' : '0px', overflow: 'hidden' }}
        initial={{ height: 'auto' }}
        animate={{ height: open ? 'auto' : 0 }}
        transition={{ duration: 0.15, type: 'tween' }}
      >
        <AnimatePresence>
          <motion.div 
            className="flex"
            animate={{
              x: -slide * width,
              transition: {type: 'spring', bounce: 0.1, duration: 0.3}
            }}
          >
            {data.map((dividedArray, index) => (
              <motion.div 
                ref={groupsPars} 
                className="flex flex-col min-w-full gap-2 px-2"
                initial={{ scale: slide === index ? 1 : 0.8 }}
                animate={{ scale: slide === index ? 1 : 0.8 }}
                transition={{ duration: 0.15 }}
              >
                {dividedArray.map((group: IDataSourceType, index) => (
                  <AnimatePresence>
                    <motion.div 
                      className="flex gap-4 items-center w-full"
                      initial={{ scale: open ? 1 : 0.8 }}
                      animate={{ scale: open ? 1 : 0.8 }}
                      transition={{ duration: 0.15, delay: 0.04 * index }}
                    >
                      <Avatar size={50} style={{ minWidth: '50px' }} src={group.avatar} />
                      <div className=" w-full flex justify-between items-center">
                        <Title level={5} style={{ margin: '0 0' }}>{group.title}</Title>
                        <p className='m-0 flex gap-1 font-[]'>{group.bots} <BugTwoTone twoToneColor={colors.accent}/></p>
                        {/* <p className='m-0 '>{getastSeenMessage(new Date(group.date))}</p> */}
                      </div>
                    </motion.div>
                  </AnimatePresence>
                ))}
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
        <div className="flex justify-between items-center">
          <Button 
            disabled={slide < 1 ? true : false}
            type='text' 
            style={{ margin: '0 0', padding: '0 9px' }}
            onClick={() => slideLeft()}
          >
            <LeftOutlined />
          </Button>
          {slide + 1}
          <Button 
            disabled={slide > data.length - 2 ? true : false}
            type='text' 
            style={{ margin: '0 0', padding: '0 9px' }}
            onClick={() => slideRight()}
          >
            <RightOutlined />
          </Button>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
