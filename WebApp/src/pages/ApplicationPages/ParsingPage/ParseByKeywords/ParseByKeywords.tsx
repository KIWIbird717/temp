import React, { useContext, useEffect, useRef } from 'react'
import { AccordionStyled } from '../Accordion/AccordionStyled'
import { Button, Col, Divider, Dropdown, Form, FormInstance, Input, InputRef, Modal, Popconfirm, Popover, Row, Spin, Statistic, Table } from 'antd'
import { BuildOutlined, CommentOutlined, DeleteOutlined, FolderOpenOutlined, InfoCircleOutlined, PlusOutlined, UserOutlined, UserSwitchOutlined } from '@ant-design/icons'
import { Typography } from 'antd'
import { useState } from 'react'
import { IParseFolders } from '../../../../store/types'
import { useSelector } from 'react-redux'
import { StoreState } from '../../../../store/store'
import groupFolder from '../../../../images/groupFolder.svg'
import accountsFolder from '../../../../images/accountsFolder.svg'
import { ModalAddNewParsingFolder } from '../ParseFolders/ModalAddNewParsingFolder'
import { SliderDriwer } from '../../../../components/SliderDrawer/SliderDriwer'
import styles from '../../Autoreg/folder-selection-style.module.css'

const { Title } = Typography


const EditableContext = React.createContext<FormInstance<any> | null>(null);

interface Item {
  key: string;
  name: string;
  age: string;
  address: string;
}

interface EditableRowProps {
  index: number;
}

const EditableRow: React.FC<EditableRowProps> = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

interface EditableCellProps {
  title: React.ReactNode;
  editable: boolean;
  children: React.ReactNode;
  dataIndex: keyof Item;
  record: Item;
  handleSave: (record: Item) => void;
}

const EditableCell: React.FC<EditableCellProps> = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef<InputRef>(null);
  const form = useContext(EditableContext)!;

  useEffect(() => {
    if (editing) {
      inputRef.current!.focus();
    }
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({ [dataIndex]: record[dataIndex] });
  };

  const save = async () => {
    try {
      const values = await form.validateFields();

      toggleEdit();
      handleSave({ ...record, ...values });
    } catch (errInfo) {
      console.log('Save failed:', errInfo);
    }
  };

  let childNode = children;

  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{ margin: 0 }}
        name={dataIndex}
        rules={[
          {
            required: true,
            message: `${title} is required.`,
          },
        ]}
      >
        <Input ref={inputRef} onPressEnter={save} onBlur={save} />
      </Form.Item>
    ) : (
      <div className="editable-cell-value-wrap" style={{ paddingRight: 24 }} onClick={toggleEdit}>
        {children}
      </div>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};

type EditableTableProps = Parameters<typeof Table>[0];

interface DataType {
  key: number;
  keyword: string;
}

type ColumnTypes = Exclude<EditableTableProps['columns'], undefined>;


interface IProps {
  id: number,
  expanded: string | boolean,
  onChange: (event: React.SyntheticEvent<Element, Event>, expanded: boolean) => void,
}

export const ParseByKeywords = ({id, expanded, onChange}: IProps) => {
  const pasingFoldersRaw: IParseFolders[] | null = useSelector((state: StoreState) => state.user.userParsingFolders)

  const [avaliableAccountsLoading, setAvaliableAccountsLoading] = useState<boolean>(false)
  const [newFolderModal, setNewFolderModal] = useState<boolean>(false)
  const [selectedFolder, setSelectedFolder] = useState<IParseFolders | null>(null)

  // Modal
  const [modal, setModal] = useState<boolean>(false)
  const [accaountsFolders, setAccountsFolders] = useState<IParseFolders[] | null>(pasingFoldersRaw)


  // Table properties
  const [dataSource, setDataSource] = useState<DataType[]>([
    {
      key: 0,
      keyword: 'Слово для парсинга 1',
    },
    {
      key: 1,
      keyword: 'Слово для парсинга 2',
    },
  ]);

  const [count, setCount] = useState(2);

  const handleDelete = (key: React.Key) => {
    const newData = dataSource.filter((item) => item.key !== key);
    setDataSource(newData);
  };

  const defaultColumns: (ColumnTypes[number] & { editable?: boolean; dataIndex: string })[] = [
    {
      dataIndex: 'keyword',
      width: '90%',
      editable: true,
    },
    {
      dataIndex: 'key',
      render: (_, record: any) =>
        dataSource.length >= 1 ? (
          <Popconfirm title="Удалить?" onConfirm={() => handleDelete(record.key)}>
            <a>Удалить</a>
          </Popconfirm>
        ) : null,
    },
  ];

  const handleAdd = () => {
    const newData: DataType = {
      key: count,
      keyword: 'Слово для парсинга',
    };
    setDataSource([...dataSource, newData]);
    setCount(count + 1);
  };

  const handleSave = (row: DataType) => {
    const newData = [...dataSource];
    const index = newData.findIndex((item) => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    setDataSource(newData);
  };

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };

  const columns = defaultColumns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: DataType) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave,
      }),
    };
  });


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
        title={'Парсинг юзеров по ключевым словам'}
        dopTitle={'Парсинг по словам из описания профиля аккаунта'}
        id={id}
        expanded={expanded}
        onChange={onChange}
      >
        <div className="m-2 flex flex-col gap-4">
          <div className="w-full flex flex-col gap-1">
            <div className="w-full flex justify-between">
              <div className="flex gap-2 items-center">
                <Title level={5} style={{ margin: '0 0' }}>Ключевые слова</Title>
                <Popover className='cursor-pointer' title="Ключевые слова" content="Добавьте слова для парсинга. Нажмите Добаить и измените внесенный столбец">
                  <InfoCircleOutlined />
                </Popover>
              </div>
              <Button
                type="link"
                icon={<PlusOutlined />}
                onClick={() => handleAdd()}
              >
                Добавить
              </Button>
            </div>
            <Table 
              style={{ margin: '0 0' }}
              rowClassName={() => 'editable-row'}
              components={components}
              columns={columns as ColumnTypes}
              dataSource={dataSource}
              pagination={{ pageSize: 5 }}
            />
          </div>

          <Divider style={{ margin: '0 0' }}/>

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
              <Col span={12} className='flex items-end'>
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
function setDeleteModal(arg0: { open: boolean; record: Item }): void {
  throw new Error('Function not implemented.')
}

