import React, { useState } from 'react'
import tableCard from '../../images/tableCard.svg'
import { Button, Typography } from 'antd'
import { colors } from '../../global-style/style-colors.module'
import { UploadOutlined } from '@ant-design/icons'

const { Title } = Typography

type props = {
  className?: string
}

export const FolserSelection = ({className}: props) => {
  const [folderTitile, setFolderTitle] = useState('Название папки')
  const [folderDopTitle, setFolderDopTitle] = useState<string>('Тут может быть описание папки')

  return (
    <div className={`w-full flex items-center gap-4 ${className}`}>
      <div className="object-contain h-[130px]">
        <img className='h-full' src={tableCard} alt='table card'/>
      </div>
      <div className="flex flex-col gap-3">
        <Title 
          editable 
          level={3} 
          style={{ margin: '0 0' }}
        >
            {folderTitile}
        </Title>
        <Title 
          editable 
          level={5} 
          style={{margin: '0 0', fontWeight: 'normal', color: colors.dopFont}}
          >
            {folderDopTitle}
        </Title>
        {/* <div className="flex gap-3">
          <Button icon={<UploadOutlined />}>Добавить в папку</Button>
        </div> */}
      </div>
    </div>
  )
}
