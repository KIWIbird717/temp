import TextArea from 'antd/es/input/TextArea'
import proxyCard from '../../../images/proxyFolder.svg'
import { Input, Modal } from 'antd'
import { useState } from 'react'

interface IModalAddNewProxy {
  open: boolean,
  onOk: () => void,
  onCancel: () => void,
  className?: string
}

export const ModalAddNewProxy = ({open, onOk, onCancel, className}: IModalAddNewProxy) => {
  const [folderTitle, setFolderTitle] = useState<string | null>('Название папки')
  const [folderDescription, setFolderDescription] = useState<string | null>('')

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

  const resetAllData = () => {
    setFolderTitle(null)
    setFolderDescription(null)
  }
  
  return (
    <Modal
      title="Новая папка для proxy"
      open={open}
      onOk={onOk}
      onCancel={() => {onCancel(); resetAllData()}}
      okButtonProps={{ title: 'Добавить' }}
      cancelButtonProps={{ title: 'Отмена' }}
    >
    <div className={`w-[100%] my-8 flex items-center gap-4 ${className}`}>
      <div className="object-contain h-[130px]">
        <img className='h-full' src={proxyCard} alt='table card'/>
      </div>
      <div className="flex flex-col gap-3 w-full">
        <Input 
          size="large" 
          placeholder="Название папки" 
          value={folderTitle || ""}
          onChange={(e) => handleFolderTitle(e.currentTarget.value)}
        />
        <TextArea
          value={folderDescription || ""}
          onChange={(e) => setFolderDescription(e.target.value)}
          placeholder="Добавьте описание"
          autoSize={{ minRows: 2, maxRows: 5 }}
          showCount
          maxLength={50}
        />
      </div>
    </div>
    </Modal>
  )
}
