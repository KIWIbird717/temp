import { useState } from 'react'
import tableCard from '../../../images/tableCard.svg'
import { Typography } from 'antd'
import { colors } from '../../../global-style/style-colors.module'
import styles from './folder-selection-style.module.css'

const { Title } = Typography

interface IProps {
  className?: string
}

export const FolserSelection = ({className}: IProps): JSX.Element => {
  const [folderTitile, setFolderTitle] = useState('Название папки')
  const [folderDopTitle, setFolderDopTitle] = useState<string>('Тут может быть описание папки')

  return (
    <div className={`w-full flex items-center gap-4 ${className}`}>
      <div className="object-contain h-[130px]">
        <img className='h-full' src={tableCard} alt='table card'/>
      </div>
      <div className="flex flex-col gap-3 w-full">
        <Title 
          editable 
          level={3} 
          style={{ margin: '0 0', width: '100%' }}
          className={styles.folder_styles}
        >
            {folderTitile}
        </Title>
        <Title 
          editable 
          level={5} 
          style={{margin: '0 0', fontWeight: 'normal', width: '100%', color: colors.dopFont}}
          >
            {folderDopTitle}
        </Title>
      </div>
    </div>
  )
}
