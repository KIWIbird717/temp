import { useState, useEffect } from 'react'
import { contentStyle } from '../../../global-style/layoutStyle'
import { HeaderComponent } from '../../../components/HeaderComponent/HeaderComponent'
import { Layout  } from 'antd'
import { Folders } from './Folders'
import { AccountsTable } from './AccountsTable'
import { useSelector } from 'react-redux'
import { StoreState } from '../../../store/store'


const { Content } = Layout

export const ProxyManagerPage = () => {
  const [openFolder, setOpenFolder] = useState<React.Key | null>(null)
  const currentFolder = useSelector((state: StoreState) => state.app.proxyManagerFolder)

  useEffect(() => {
    setOpenFolder(currentFolder)
    // console.log(currentFolder)
  }, [currentFolder])

  return (
      <Layout style={{...contentStyle, minHeight: '100vh'}}>
        <HeaderComponent title='Менеджер proxy'/>

        <Content className='h-full flex flex-col gap-10'>
          {openFolder ? (
            <AccountsTable />
            ) : (
            <Folders />
          )}
        </Content>
      </Layout>
  )
}
