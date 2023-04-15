import React from 'react'
import { Button, Checkbox, Form, Input, Typography } from 'antd';
import { LockOutlined, MailOutlined } from '@ant-design/icons';
import { colors } from '../global-style/style-colors.module';
import axios from 'axios';

const { Title } = Typography

interface IOnFinish {
  mail: string,
  password: 'string',
  remember: boolean
}

export const Registration = () => {
  const onFinish = async ({mail, password, remember}: IOnFinish): Promise<void> => {
    const url: string = `${process.env.REACT_APP_SERVER_END_POINT as string}/registration`

    axios.post(url, { mail, password, remember })
      .then((res: any) => console.log(res))
      .catch((err: any) => console.log(err))
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
            rules={[{ required: true, message: 'Пожалуйста, введите Почту!' }]}
            style={{ width: '100%' }}
          >
            <Input size="large" prefix={<MailOutlined className="site-form-item-icon" />} placeholder="Почта" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Пожалуйста, введите пароль!' }]}
            style={{ width: '100%' }}
          >
            <Input
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
            <Button size='large' type="primary" htmlType="submit" style={{ width: '100%', background: colors.primary }}>
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
