import React from 'react'
import { Card, Descriptions } from 'antd'
import { CheckCircleFilled, ExclamationCircleFilled, WarningFilled } from '@ant-design/icons'
import { colors } from '../../global-style/style-colors.module'

const { Item } = Descriptions

interface IProps {
  className?: string,
  title: string,
  dopTitle: string,
  type: 'success' | 'warning' | 'error',
  date: string,
}

export const StaticMessage = ({ className, title, dopTitle, type, date }: IProps) => {
  return (
    <Card style={{ margin: '1px 1px' }} className={`${className} w-full`}>
      <div className="flex gap-4">
        <div className="flex gap-3 items-start mt-[2px]">
          {type === 'success' && <CheckCircleFilled style={{ fontSize: '23px', color: colors.success }} />}
          {type === 'warning' && <WarningFilled  style={{ fontSize: '23px', color: colors.warning }} />}
          {type === 'error' && <ExclamationCircleFilled   style={{ fontSize: '23px', color: colors.danger }} />}
        </div>
        <div>
          <p style={{ margin: '0 0', fontWeight: '600', marginBottom: '10px' }} className='text-[18px]'>{title}</p>
          <p style={{ margin: '0 0' }}>{dopTitle}</p>
          <Descriptions>
            <Descriptions.Item label='Дата' style={{ padding: '0 0' }}>
              {date}
            </Descriptions.Item>
          </Descriptions>
        </div>
      </div>
    </Card>
  )
}
