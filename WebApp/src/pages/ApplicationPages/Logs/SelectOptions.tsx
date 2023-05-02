import { Select } from 'antd'

export const SelectOptions = () => {

  const handleChange = (value: string | string[]) => {
    console.log(`Selected: ${value}`)
  }

  const options = [
    {
      label: 'Ошибки',
      value: 'error',
    },
    {
      label: 'СМС сервис',
      value: 'srvice',
    },
    {
      label: 'Телеграм',
      value: 'telegram',
    },
    {
      label: 'Сообщение',
      value: 'message',
    }
  ]

  return (
    <Select
      mode="multiple"
      size='large'
      onChange={handleChange}
      style={{ width: 540 }}
      options={options}
      defaultValue={['error', 'srvice', 'telegram', 'message']}
    />
  )
}
