import React, { useState } from 'react'
import { Button, Form, Input, Typography } from 'antd';
import { LockOutlined, MailOutlined } from '@ant-design/icons';
import { colors } from '../global-style/style-colors.module';
import axios from 'axios';
import { Rule } from 'antd/lib/form';
import { Link } from 'react-router-dom';
import { notification } from 'antd';
import { useDispatch } from 'react-redux';
import { setUserIsLogined, setUserMail } from '../store/userSlice';
import { isValidEmail } from '../utils/isValidEmail';


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

export const Registration = () => {
  const [loading, setLoading] = useState<boolean>(false)
  const [formError, setFormError] = useState<IFormError>({validate: "", msg: ""})
  
  const dispatch = useDispatch()

  const notificationHandler = () => {
    notification['error']({
      message: 'Что-то пошло не так',
      description: 'Попробуйте зарегестрироваться позже. Возможно ошибка сервера',
      placement: 'bottomRight'
    })
  }

  const onFinish = async ({mail, password, remember}: IOnFinish): Promise<void> => {
    try {
      if (!mail) {
        setFormError({validate: "error", msg: 'Пожалуйста, введите Почту!' })
        return
      }
      if (!isValidEmail(mail)) {
        setFormError({validate: "error", msg: 'Введите правильный адрес почты' })
        return
      }
      setLoading(true)
      const url: string = `${process.env.REACT_APP_SERVER_END_POINT as string}/newUser/registration`
  
      await axios.post(url, { mail, password, remember })
        .then((res: any) => {
          if (res.status === 201) {
            dispatch(setUserMail(mail))
            dispatch(setUserIsLogined(true))
          }
          setLoading(false)
        })

    } catch (err: any) {
      setLoading(false)

      if (err.response?.data.message === "User with this email already exists") {
        setFormError({validate: "error", msg: 'Такой пользователь уже существует'})
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
          <Title>Регистрация</Title>
          <Form.Item
            name="mail"
            style={{ width: '100%' }}
            validateStatus={formError.validate}
            help={formError.msg}
          >
            <Input size="large" prefix={<MailOutlined className="site-form-item-icon" />} placeholder="Почта" onChange={() => setFormError({validate: "", msg: ""})}/>
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Пожалуйста, введите пароль!' }]}
            style={{ width: '100%' }}
          >
            <Input.Password
              size="large"
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Пароль"
            />
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
              <Link to="/login">Войдите</Link>
            </div>
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}
