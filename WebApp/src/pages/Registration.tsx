import React, { useState } from 'react'
import { Button, Checkbox, Form, Input, Typography } from 'antd';
import { LockOutlined, MailOutlined } from '@ant-design/icons';
import { colors } from '../global-style/style-colors.module';
import axios from 'axios';
import { Rule } from 'antd/lib/form';

const { Title } = Typography

interface IOnFinish {
  mail: string,
  password: 'string',
  remember: boolean
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

export const Registration = () => {
  const [loading, setLoading] = useState<boolean>(false)

  const onFinish = async ({mail, password, remember}: IOnFinish): Promise<void> => {
    try {
      // setLoading(true)
      const url: string = `${process.env.REACT_APP_SERVER_END_POINT as string}/newUser/registration`
  
      await axios.post(url, { mail, password, remember })
        .then((res: any) => console.log(res.response.data.message))
    } catch (err) {
      // setLoading(false)
      console.log('error', (err as any).response.data.message)
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
          <Title>Регистрация</Title>
          <Form.Item
            name="mail"
            rules={emailRules}
            style={{ width: '100%' }}
          >
            <Input size="large" prefix={<MailOutlined className="site-form-item-icon" />} placeholder="Почта" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Пожалуйста, введите пароль!' }]}
            style={{ width: '100%' }}
            hasFeedback
          >
            <Input.Password
              size="large"
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Пароль"
            />
          </Form.Item>
          <Form.Item style={{ width: '100%' }}>
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <div className='flex justify-between'>
                <Checkbox>Запомнить меня</Checkbox>
                <a className="login-form-forgot" href="">
                  Забыли пароль?
                </a>
              </div>
            </Form.Item>
          </Form.Item>

          <Form.Item style={{ width: '100%' }}>
            <Button 
              loading={loading} 
              size='large' 
              type="primary" 
              htmlType="submit" 
              style={{ width: '100%', background: colors.primary }}
            >
              Зарегестрироваться
            </Button>
          </Form.Item>

          <Form.Item style={{ width: '100%' }}>
            <div className='w-full flex justify-between'>
              Уже есть аккаунт?
              <a href="">Войдите</a>
            </div>
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}
