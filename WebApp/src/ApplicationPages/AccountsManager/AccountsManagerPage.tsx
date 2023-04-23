import { useState, useEffect } from 'react'
import { contentStyle } from '../../global-style/layoutStyle'
import { HeaderComponent } from '../../components/HeaderComponent/HeaderComponent'
import { Typography, Layout  } from 'antd'
import { Folders } from './Folders'
import { AccountsTable } from './AccountsTable'
import { useSelector } from 'react-redux'
import { StoreState } from '../../store/store'


const { Title } = Typography
const { Content } = Layout

export const AccountsManagerPage = () => {
  const [openFolder, setOpenFolder] = useState<React.Key | null>(null)
  const currentFolder = useSelector((state: StoreState) => state.app.accountsManagerFolder)

  useEffect(() => {
    setOpenFolder(currentFolder)
    console.log(currentFolder)
  }, [currentFolder])

  return (
      <Layout style={contentStyle}>
        <HeaderComponent title='Менеджер аккаунтов'/>

        <Content className='flex flex-col gap-10'>
          {openFolder ? (
            <AccountsTable />
            ) : (
            <Folders />
          )}
        </Content>
      </Layout>
  )
}
