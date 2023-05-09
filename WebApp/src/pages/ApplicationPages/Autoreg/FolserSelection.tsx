import { useState } from 'react'
import tableCard from '../../../images/tableCard.svg'
import { Input, Typography } from 'antd'
import TextArea from 'antd/es/input/TextArea'

const { Title } = Typography

interface IProps {
  className?: string
}

export const FolserSelection = ({className}: IProps): JSX.Element => {
  const [folderTitle, setFolderTitle] = useState<string>('Название папки')
  const [folderDescription, setFolderDescription] = useState<string>('')

  const cancelAllChanges = () => {
    setFolderTitle('')
    setFolderDescription('')
  }

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
    <div className={`w-[60%] flex items-center gap-4 ${className}`}>
      <div className="object-contain h-[130px]">
        <img className='h-full' src={tableCard} alt='table card'/>
      </div>
      <div className="flex flex-col gap-3 w-full">
        <Input 
          size="large" 
          placeholder="Название папки" 
          onChange={(e) => handleFolderTitle(e.currentTarget.value)}
        />
        <TextArea
          value={folderDescription}
          onChange={(e) => setFolderDescription(e.target.value)}
          placeholder="Добавьте описание"
          autoSize={{ minRows: 2, maxRows: 5 }}
          showCount
          maxLength={50}
        />
      </div>
    </div>
  )
}
