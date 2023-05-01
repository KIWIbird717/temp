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
  const [folderTitle, setFolderTitle] = useState<string>('Название папки')
  const [folderDescription, setFolderDescription] = useState<string>('Описание папки')

  const handleFolderTitle = (string: string): void => {
    const titleLen = string.length
    if (titleLen < 3) {
      setFolderTitle('Название папки')
      return
    }
    if (string.toLowerCase() === 'хуй') {
      setFolderTitle(':)')
      return
    }
    if (string.toLowerCase() === 'меня всё заебало') {
      setFolderTitle('Меня тоже...')
      return
    }
    if (string.toLowerCase() === 'иди нахуй') {
      setFolderTitle('Будь повежливей')
      return
    }

    setFolderTitle(string)
  }

  const handleFolderDescription = (string: string) => {
    const titleLen = string.length
    if (titleLen < 3) {
      setFolderDescription('Название папки')
      return
    }
    if (string.toLowerCase() === 'хуй') {
      setFolderDescription(':)')
      return
    }
    if (string.toLowerCase() === 'меня всё заебало') {
      setFolderDescription('Меня тоже...')
      return
    }
    if (string.toLowerCase() === 'иди нахуй') {
      setFolderDescription('Будь повежливей')
      return
    }

    setFolderDescription(string)
  }

  return (
    <div className={`w-full flex items-center gap-4 ${className}`}>
      <div className="object-contain h-[130px]">
        <img className='h-full' src={tableCard} alt='table card'/>
      </div>
      <div className="flex flex-col gap-3 w-full">
        <Title 
          editable={{
            maxLength: 20,
            onChange: handleFolderTitle,
            text: folderTitle
          }}
          level={3} 
          style={{ margin: '0px 0px', width: '100%' }}
          className={styles.folder_styles}
        >
            {folderTitle}
        </Title>
        <Title 
          editable={{
            maxLength: 50,
            onChange: handleFolderDescription,
            text: folderDescription
          }}
          level={5} 
          style={{margin: '5px 5px', fontWeight: 'normal', width: '100%', color: colors.dopFont}}
          >
            {folderDescription}
        </Title>
      </div>
    </div>
  )
}
