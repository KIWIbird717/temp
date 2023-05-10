import TextArea from 'antd/es/input/TextArea'
import proxyCard from '../../../images/tableCard.svg'
import { Input, Modal } from 'antd'
import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { StoreState } from '../../../store/store'
import { setUserManagerFolders } from '../../../store/userSlice'
import { IHeaderType } from '../AccountsManager/Collumns'

interface IModalAddNewAccount {
  open: boolean,
  onOk: () => void,
  onCancel: () => void,
  setSelectedFolder: (e: IHeaderType | null) => void
  className?: string
}

interface IInputStatus {
  status: "" | "warning" | "error" | undefined,
  msg: string
}

export const ModalAddNewFolder = ({open, onOk, onCancel, setSelectedFolder, className}: IModalAddNewAccount) => {
  const dispatch = useDispatch()
  const accountsFoldersData: IHeaderType[] | null = useSelector((state: StoreState) => state.user.userManagerFolders)

  const [folderTitle, setFolderTitle] = useState<string | null>('')
  const [folderDescription, setFolderDescription] = useState<string | null>('')
  const [inputStatus, setInputStatus] = useState<IInputStatus>({status: "", msg: ''})
  const [textAreaStatus, setTextAreaStatus] = useState<IInputStatus>({status: "", msg: ''})

  const resetAllData = () => {
    setFolderTitle(null)
    setFolderDescription(null)
  }

  const handleFolderTitle = (string: string): void => {
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

  const handleNewProxyFolder = (): void => {
    if (folderTitle === '') {
      setInputStatus({status: "error", msg: "Введите название папки"})
      return
    }
    if (folderDescription === '') {
      setTextAreaStatus({status: "error", msg: "Введите описание папки"})
      return
    }

    let maxKey = Math.max(...accountsFoldersData?.map((folder) => Number(folder.key) as number) || [0]) + 1
    if (maxKey === -Infinity) { maxKey = 0 }

    const newAccountsFolder: IHeaderType = {
      key: maxKey.toString(),
      folder: folderTitle || 'Не указано',
      dopTitle: folderDescription || 'Не указано',
      accountsAmount: 0,
      country: 'Не указано',
      latestActivity: Date.now().toString(),
      banned: 0,
      accounts: []
    }
    setSelectedFolder(newAccountsFolder)

    if (accountsFoldersData) {
      const newAccountsData = [...accountsFoldersData, newAccountsFolder]
      dispatch(setUserManagerFolders(newAccountsData))
    } else {
      const newAccountsData = [newAccountsFolder]
      dispatch(setUserManagerFolders(newAccountsData))
    }
    resetAllData()
    onCancel()
  }
  
  return (
    <Modal
      title="Новая папка для аккаунтов"
      open={open}
      onOk={() => handleNewProxyFolder()}
      onCancel={() => {resetAllData(); onCancel()}}
      okButtonProps={{ title: 'Добавить' }}
      cancelButtonProps={{ title: 'Отмена' }}
      okText='Добавить'
      cancelText='Отмена'
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
          status={inputStatus.status}
          onChange={(e) => {setInputStatus({status: "", msg: ""});handleFolderTitle(e.currentTarget.value)}}
        />
        <TextArea
          status={textAreaStatus.status}
          value={folderDescription || ""}
          onChange={(e) => {setTextAreaStatus({status: "", msg: ""}); setFolderDescription(e.target.value)}}
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
