import React, { useState } from 'react'
import { Button, Checkbox, Form, Input, Typography } from 'antd';
import { LockOutlined, MailOutlined } from '@ant-design/icons';
import { colors } from '../global-style/style-colors.module';
import axios from 'axios';
import { Rule } from 'antd/lib/form';
import type { NotificationPlacement } from 'antd/es/notification/interface';
import { notification } from 'antd';

const { Title } = Typography

interface IOnFinish {
  mail: string,
  password: 'string',
  remember: boolean
}

interface IFormError {
  validate: "" | "success" | "warning" | "error" | "validating" | undefined,
  msg: string
}

const emailRules: Rule[] = [
  {
    type: 'email',
    message: 'Введите правильный адрес почты'
  },
  { 
    required: true, 
    message: 'Пожалуйста, введите Почту!' 
  }
]

export const Logining = () => {
  const [loading, setLoading] = useState<boolean>(false)
  const [formError, setFormError] = useState<IFormError>({validate: "", msg: ""})

  const notificationHandler = () => {
    notification['error']({
      message: 'Что-то пошло не так',
      description: 'Попробуйте зарегестрироваться позже. Возможно ошибка сервера',
      placement: 'bottomRight'
    })
  }

  const onFinish = async ({mail, password}: IOnFinish): Promise<void> => {
    try {
      setLoading(true)
      const url: string = `${process.env.REACT_APP_SERVER_END_POINT as string}/newUser/login`
  
      await axios.post(url, { mail, password })
        .then((res: any) => console.log('res', res))
        .then(() => setLoading(false))
    } catch (err: any) {
      setLoading(false)

      if (err.response?.data.message === "Uncurrect password") {
        setFormError({validate: "error", msg: 'Неверный пароль'})
      } else {
        notificationHandler()
      }
    }
  }

  return (
    <div className='w-ful h-[100vh] flex items-center justify-center'>
      <div className='w-[300px]'>
        <Form
          name="normal_login"
          className="login-form"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
        >
          <Title>Авторизация</Title>
          <Form.Item
            name="mail"
            rules={emailRules}
            style={{ width: '100%' }}
          >
            <Input size="large" prefix={<MailOutlined className="site-form-item-icon" />} placeholder="Почта" onChange={() => setFormError({validate: "", msg: ""})}/>
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Пожалуйста, введите пароль!' }]}
            style={{ width: '100%' }}
            validateStatus={formError.validate}
            help={formError.msg}
          >
            <Input.Password
              size="large"
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Пароль"
            />
          </Form.Item>
          {/* <Form.Item style={{ width: '100%' }}>
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <div className='flex justify-between'>
                <Checkbox>Запомнить меня</Checkbox>
                <a className="login-form-forgot" href="">
                  Забыли пароль?
                </a>
              </div>
            </Form.Item>
          </Form.Item> */}

          <Form.Item style={{ width: '100%' }}>
            <Button 
              loading={loading} 
              size='large' 
              type="primary" 
              htmlType="submit" 
              style={{ width: '100%', background: colors.primary }}
            >
              Войти
            </Button>
          </Form.Item>

        </Form>
      </div>
    </div>
  )
}
