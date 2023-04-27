import React, { useState } from 'react'
import { Avatar, List, Popover, Typography, Table, Button, Popconfirm } from 'antd'
import { DeleteOutlined, InfoCircleOutlined } from '@ant-design/icons'
import { formatDate } from '../../../utils/formatDate'

const { Title } = Typography

interface IProps {
  title: string
}

interface IDateType {
  key: React.Key,
  avatar: string,
  title: string
}

type EditableTableProps = Parameters<typeof Table>[0]
type ColumnTypes = Exclude<EditableTableProps['columns'], undefined>

export const Groups = ({title}: IProps) => {
  const [count, setCount] = useState(2)
  const [dataSource, setDataSource] = useState<IDateType[]>([
    {
      key: '0',
      title: 'Pro designer',
      avatar: 'https://randomwordgenerator.com/img/picture-generator/52e4d0464c54a414f1dc8460962e33791c3ad6e04e50744075287bd4954cc3_640.jpg'
    },
    {
      key: '1',
      title: 'My chat',
      avatar: 'https://randomwordgenerator.com/img/picture-generator/54e2d7454b54ad14f1dc8460962e33791c3ad6e04e507441722a72d39f4fcc_640.jpg'
    },
    {
      key: '2',
      title: 'Новости today',
      avatar: 'https://randomwordgenerator.com/img/picture-generator/54e5d4444c57af14f1dc8460962e33791c3ad6e04e507441722a72dc924ac5_640.jpg'
    },
    {
      key: '3',
      title: 'Дачный сезон',
      avatar: 'https://randomwordgenerator.com/img/picture-generator/57e6d34b4b56ad14f1dc8460962e33791c3ad6e04e507441722a72d39e4ecc_640.jpg'
    },
  ])

  const date = formatDate(new Date())

  const defaultColumns: any = [
    {
      title: {title},
      dataIndex: 'title',
      render: (_: any, record: any) => (
        <div className="flex justify-between">
          <div className="flex gap-3">
            <Avatar src={record.avatar}/>
            {record.title} 
          </div>
          <Popconfirm
            placement='topRight'
            title={`Удалить ${title}`}
            description={`Вы уверены, что хотите удалить ${title}`}
            onConfirm={() => console.log()}
            onCancel={() => console.log()}
            okText="Удалить"
            cancelText="Отмена"
          >
            <Button danger type='link' icon={<DeleteOutlined />}/>
          </Popconfirm>
        </div>
      )
    }
  ]

  const handleAdd = () => {
    const newData: IDateType = {
      key: count,
      title: 'New group chat',
      avatar: 'https://randomwordgenerator.com/img/picture-generator/57e6d34b4b56ad14f1dc8460962e33791c3ad6e04e507441722a72d39e4ecc_640.jpg',
    }
    setDataSource([...dataSource, newData])
    setCount(count + 1)
  };

  const handleDelete = (key: React.Key) => {
    const newData = dataSource.filter((item) => item.key !== key);
    setDataSource(newData);
  }

  const handleSave = (row: IDateType) => {
    const newData = [...dataSource];
    const index = newData.findIndex((item) => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    setDataSource(newData);
  }

  const columns = defaultColumns.map((col: any) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: IDateType) => ({
        record,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave,
      }),
    };
  })

  return (
    <div className='flex flex-col gap-1'>
      <div className="flex gap-2 items-center">
        <Title level={5} style={{ margin: '0 0' }}>{title}</Title>
        <Popover className='cursor-pointer' title={title} content={`Добавляйте новые ${title} для телеграм аккаунтов`}>
          <InfoCircleOutlined />
        </Popover>
      </div>

      <Table 
        bordered
        size='middle'
        showHeader={false}
        dataSource={dataSource}
        pagination={{ pageSize: 3 }}
        columns={defaultColumns}
      />
    </div>
  )
}
