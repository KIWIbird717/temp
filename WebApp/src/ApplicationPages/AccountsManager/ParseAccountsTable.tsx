import React, { useState, useEffect, useRef } from 'react'
import type { ColumnsType, ColumnType } from 'antd/es/table';
import { 
  generateRandomPhoneNumber, 
  generateRandomResting,
  generateRandomName,
  generateRandomString,
  generateRandomCountry,
  generateRandomDate,
  generateRandomStatus
 } from './generateTempData';
import { Tag, InputRef, Space, Input, Button, Dropdown, message, InputNumber, Form } from 'antd';
import { CheckSquareOutlined, DeleteOutlined, EditOutlined, EnterOutlined, ExportOutlined, MoreOutlined, SearchOutlined, UploadOutlined, UserOutlined } from '@ant-design/icons';
import type { FilterConfirmProps } from 'antd/es/table/interface';
import Highlighter from 'react-highlight-words';
import type { MenuProps } from 'antd';


export interface IAccountsData {
  key: React.Key,
  phoneNumber: string,
  resting: string,
  fullName: string,
  secondFacAith: string,
  proxy: string,
  latestActivity: string,
  status: string,
}

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: string;
  title: any;
  inputType: 'number' | 'text';
  record: IAccountsData;
  index: number;
  children: React.ReactNode;
}

type DataIndex = keyof IAccountsData;

const GetColumnSearchProps = (data: DataIndex) => {
  const [searchText, setSearchText] = useState<string>('')
  const [searchedColumn, setSearchedColumn] = useState<string>('')
  const searchInput = useRef<InputRef>(null)

  const handleSearch = (
    selectedKeys: string[],
    confirm: (param?: FilterConfirmProps) => void,
    dataIndex: DataIndex,
  ) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  
  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchText('');
  };
  
  const getColumnSearchProps = (dataIndex: DataIndex): ColumnType<IAccountsData> => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder="Поиск по номеру"
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Поиск
          </Button>
          <Button
            onClick={() => {clearFilters && handleReset(clearFilters); handleSearch([''] as string[], confirm, dataIndex)}}
            size="small"
            style={{ width: 90 }}
          >
            Вернуть
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes((value as string).toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });

  return getColumnSearchProps(data)
}

export const TableHeaders = () => {
  
  const dropDownItems: MenuProps['items'] = [
    {
      key: '0',
      label: 'Редактировать',
      icon: <EditOutlined />,
    },
    {
      key: '1',
      label: 'Переместить',
      icon: <div style={{ transform: 'rotate(180deg)' }}><EnterOutlined /></div>,
    },
    {
      key: '2',
      label: 'Экспорт"',
      icon: <UploadOutlined />,
    },
    {
      key: '3',
      label: 'Валидность',
      icon: <CheckSquareOutlined />,
    },
    {
      type: 'divider',
    },
    {
      key: '4',
      label: 'Удалить',
      icon: <DeleteOutlined />,
      danger: true,
    },
  ]
  
  const tableHeaders: any = [
    {
      title: 'Номер',
      dataIndex: 'phoneNumber',
      editable: true,
      ...GetColumnSearchProps('phoneNumber')
    },
    {
      title: 'Отлёжка',
      dataIndex: 'resting'
    },
    {
      title: 'ФИО',
      dataIndex: 'fullName',
      editable: true,
      ...GetColumnSearchProps('fullName'),
    },
    {
      title: '2ФА',
      dataIndex: 'secondFacAith'
    },
    {
      title: 'Proxy',
      editable: true,
      dataIndex: 'proxy'
    },
    {
      title: 'Поседняя активность',
      dataIndex: 'latestActivity'
    },
    {
      title: 'Статус',
      dataIndex: 'status',
      render: (tags: any) => (
        <div className='flex items-center justify-between'>
          <div>
            {[tags].map((tag: string) => {
              let color: string = 'green'
              if (tag === 'active') {color = 'green'}
              if (tag === 'banned') {color = 'red'}
              if (tag === 'resting') {color = 'yellow'}
    
              return <Tag color={color} key={tag}>{tag}</Tag>
            })}
          </div>
          <Dropdown menu={{ items: dropDownItems, onClick }} trigger={['click']}>
            <Button style={{ borderWidth: '0px', boxShadow: 'inherit' }} shape="circle" icon={<MoreOutlined />} />
          </Dropdown>
        </div>
      ),
      filters: [
        {
          text: 'active',
          value: 'active'
        },
        {
          text: 'banned',
          value: 'banned'
        },
        {
          text: 'resting',
          value: 'resting'
        }
      ],
      onFilter: (value: any, record: any) => record.status.indexOf(value as string) === 0,
    }
  ]
  
  const onClick: MenuProps['onClick'] = ({ key }) => {
    message.info(`Click on item ${key}`)
  }

  const [form] = Form.useForm();
  const [data, setData] = useState(dropDownItems);
  const [editingKey, setEditingKey] = useState<React.Key>('')

  const isEditing = (record: IAccountsData) => record.key === editingKey;

  const edit = (record: Partial<IAccountsData> & { key: React.Key }) => {
    form.setFieldsValue({ phoneNumber: '', fullName: '', proxy: '', ...record })
    setEditingKey(record.key);
  }

  const cancel = () => {
    setEditingKey('')
  }

  const save = async (key: React.Key) => {
    try {
      const row = (await form.validateFields()) as IAccountsData;

      const newData = [...data];
      const index = newData.findIndex((item) => key === item?.key);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        setData(newData);
        setEditingKey('');
      } else {
        newData.push(row);
        setData(newData);
        setEditingKey('');
      }
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  }

  const mergedColumns = tableHeaders.map((col: any) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: IAccountsData) => ({
        record,
        inputType: col.dataIndex === 'age' ? 'number' : 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  
  
  return tableHeaders
}

export const EditableCell: React.FC<EditableCellProps> = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  const inputNode = inputType === 'number' ? <InputNumber /> : <Input />;

  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{ margin: 0 }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
}


export const ParseAccountsTable = () => {
  const [accountsData, setAccountsData] = useState<IAccountsData[]>([])

  useEffect(() => {
    const dummyAll = new Array(35).fill(0).map((_, index) => { return {
      key: index,
      phoneNumber: generateRandomPhoneNumber(),
      resting: generateRandomResting(),
      fullName: generateRandomName(),
      secondFacAith: generateRandomString(12),
      proxy: generateRandomCountry(),
      latestActivity: generateRandomDate(2023, 2023),
      status: generateRandomStatus(),
    }})
    setAccountsData([...dummyAll])
  }, [])

  return accountsData
}
