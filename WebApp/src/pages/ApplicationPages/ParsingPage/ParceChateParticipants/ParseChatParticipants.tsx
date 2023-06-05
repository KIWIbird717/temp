import React, { useEffect, useState } from 'react'
import { AccordionStyled } from '../Accordion/AccordionStyled'
import { Row, Col, Popover, Input, Statistic, Spin, Checkbox, Divider, Modal, Button, Segmented } from "antd"
import { Typography } from 'antd'
import { BuildOutlined, FolderOpenOutlined, InfoCircleOutlined, PlusOutlined, UserOutlined, UserSwitchOutlined } from '@ant-design/icons'
import { colors } from '../../../../global-style/style-colors.module'
import { ModalAddNewFolder } from '../../Autoreg/ModalAddNewFolder'
import { IHeaderType } from '../../AccountsManager/Collumns'
import { SliderDriwer } from '../../../../components/SliderDrawer/SliderDriwer'
import { useSelector } from 'react-redux'
import { StoreState } from '../../../../store/store'
import groupFolder from '../../../../images/groupFolder.svg'
import accountsFolder from '../../../../images/accountsFolder.svg'

import styles from '../../Autoreg/folder-selection-style.module.css'
import { IParseFolders } from '../../../../store/types'
import { ModalAddNewParsingFolder } from '../ParseFolders/ModalAddNewParsingFolder'


const { Title } = Typography

interface IProps {
  id: number,
  expanded: string | boolean,
  onChange: (event: React.SyntheticEvent<Element, Event>, expanded: boolean) => void,
}

export const ParseChatParticipants = ({id, expanded, onChange}: IProps) => {
  const pasingFoldersRaw: IParseFolders[] | null = useSelector((state: StoreState) => state.user.userParsingFolders)

  const [avaliableAccountsLoading, setAvaliableAccountsLoading] = useState<boolean>(false)
  const [newFolderModal, setNewFolderModal] = useState<boolean>(false)
  const [selectedFolder, setSelectedFolder] = useState<IParseFolders | null>(null)

  // Modal
  const [modal, setModal] = useState<boolean>(false)
  const [accaountsFolders, setAccountsFolders] = useState<IParseFolders[] | null>(pasingFoldersRaw)

  useEffect(() => {
    setAccountsFolders(pasingFoldersRaw)
  }, [pasingFoldersRaw])

  return (
    <div className="div" style={{ lineHeight: 0 }}>
      <ModalAddNewParsingFolder 
        open={newFolderModal}
        onCancel={() => setNewFolderModal(false)}
        onOk={() => setNewFolderModal(false)}
        setSelectedFolder={setSelectedFolder}
      />

      <Modal 
        style={{ borderRadius: 20 }}
        title="Выбор папки с аккаунтами" 
        open={modal} 
        onOk={() => setModal(false)} 
        onCancel={() => setModal(false)}
        footer={[
          <Button
            icon={<PlusOutlined />}
            type='primary'
            onClick={() => {setModal(false); setNewFolderModal(true)}}
          >
            Создать новую папку
          </Button>
        ]}
      >
        <div className="flex flex-col gap-3 my-5">
          <SliderDriwer 
            dataSource={accaountsFolders || []}
            open={true}
            visibleAmount={3}
            render={(el) => (
              <div 
                key={el.key} 
                className={`${styles.slider_driwer_folder} flex justify-between w-full rounded-2xl p-3 bg-white`}
                onClick={() => {setSelectedFolder(el); setModal(false)}}
              >
                <div className="flex items-center gap-5">
                  <div className='h-[110px] object-contain'>
                    <img className='w-full h-full' src={el.type === 'accounts' ? accountsFolder : groupFolder} alt='icon'/>
                  </div>
                  <div className="flex flex-col gap-1">
                    <Title style={{ margin: '0px 0px' }} level={4}>{el.title}</Title>
                    <Title style={{ margin: '0px 0px', fontWeight: '400' }} type='secondary' level={5}>{el.dopTitle}</Title>
                    <div className="flex gap-1 items-start">
                      <Title className='m-0' level={5}>{5}</Title>
                      <UserOutlined className='my-1 mt-[5px]' />
                    </div>
                  </div>
                </div>
              </div>
            )}
          />
        </div>
      </Modal>

      <AccordionStyled
        title={'Парсинг участноков чатов'}
        dopTitle={'Парсинг всех доступных участников из телеграм чата'}
        id={id}
        expanded={expanded}
        onChange={onChange}
      >
        <div className="m-2 flex flex-col gap-4">
          <div className="div">
            <Row gutter={20}>
              <Col span={12}>
                <div className="w-full flex flex-col gap-1">
                  <div className="flex gap-2 items-center">
                    <Title level={5} style={{ margin: '0 0' }}>Ссылка на телеграм чат</Title>
                    <Popover className='cursor-pointer' title="Ссылка на телеграм чат" content='Ссылку на группу или чат можно взять, нажав "троеточие" -> "info"'>
                      <InfoCircleOutlined />
                    </Popover>
                  </div>
                  <Input
                    size='large'
                    placeholder='Ссылка на телеграм чат'
                    // status={folderTitle?.value || ""} 
                    // value={folderTitle?.label}
                    // onChange={(e) => setFolderTitle({label: e.currentTarget.value, value: ""})}
                  />
                </div>
              </Col>
              <Col span={12}>
                {avaliableAccountsLoading ? (
                  <Statistic 
                    valueStyle={{ color: colors.primary }} 
                    className='w-full' 
                    title="Доступно номеров" 
                    value={' '}
                    prefix={ <div><UserSwitchOutlined /> <Spin/> </div>} 
                  />
                ) : (
                  <Statistic 
                    valueStyle={{ color: colors.primary }} 
                    className='w-full' 
                    title="Доступно аккаунтов" 
                    // value={avaliablePhones?.count !== undefined ? avaliablePhones?.count : '-'} 
                    prefix={ <UserSwitchOutlined />} 
                  />
                )}
              </Col>
            </Row>
          </div>
          <div className="" style={{ lineHeight: 0 }}> 
            <Checkbox 
              // onChange={onChange}
            >
              <Title level={5} style={{ margin: '0 0', fontWeight: 'normal', color: colors.dopFont }}>Парсить только участников, которые писали в чат</Title>
            </Checkbox>
          </div>

          <Divider style={{ margin: '0 0' }}/>

          <div className="div">
            <Row gutter={20}>
              <Col span={12}>
                {selectedFolder ? (
                  <div className="flex gap-2">
                    <div className="h-[40px] object-contain">
                      <img className='w-full h-full' src={selectedFolder.type === 'accounts' ? accountsFolder : groupFolder}/>
                    </div>
                    <Title level={4} style={{margin: '0 0', fontWeight: '500', cursor: 'default'}}>{selectedFolder.title}</Title>
                  </div>
                ) : (
                  <Button 
                    type="dashed"
                    size='large'
                    icon={<FolderOpenOutlined />}
                    onClick={() => setModal(true)}
                  >Папка для аккаунтов</Button>
                )}
              </Col>
              <Col span={12}>
                <Segmented size="large" options={['По истории', 'Лайв режим']} />
              </Col>
            </Row>
          </div>
        </div>

        <div className="m-2 mt-9 flex justify-end">
          <Button
            type='primary'
            size='large'
            icon={<BuildOutlined />}
          >
            Парсить аккаунты
          </Button>
        </div>
      </AccordionStyled>
    </div>
  )
}
