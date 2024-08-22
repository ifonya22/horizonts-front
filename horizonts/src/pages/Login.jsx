import React, { useState } from 'react';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Checkbox, Form, Input, message } from 'antd';
import axios from 'axios';

const Login = ({ setIsAuthenticated, setUserFullName }) => {
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    const { username, password } = values;

    setLoading(true);

    try {
      const response = await axios.post('http://localhost:8000/api/v1/auth/token', new URLSearchParams({
        grant_type: 'password',
        username: username,
        password: password,
        scope: '',
        client_id: '',
        client_secret: '',
      }), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      if (response.status === 200) {
        const { access_token } = response.data;
        localStorage.setItem('access_token', access_token);

        const userResponse = await axios.get('http://localhost:8000/api/v1/auth/users/me', {
          headers: {
            'Authorization': `Bearer ${access_token}`,
          },
        });

        if (userResponse.status === 200) {
          const user = userResponse.data;
          setUserFullName(user.full_name);
          setIsAuthenticated(true);
          message.success('Успешный вход!');
        } else {
          setIsAuthenticated(false);
          message.error('Не удалось получить информацию о пользователе');
        }
      } else {
        setIsAuthenticated(false);
        message.error('Неверный логин или пароль');
      }
    } catch (error) {
      setIsAuthenticated(false);
      if (error.response && error.response.status === 401) {
        message.error('Неверный логин или пароль');
      } else {
        message.error('Ошибка сети или сервера');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form
      name="login"
      initialValues={{
        remember: true,
      }}
      style={{
        maxWidth: 360,
      }}
      onFinish={onFinish}
    >
      <Form.Item
        name="username"
        rules={[
          {
            required: true,
            message: 'Пожалуйста введите свой логин!',
          },
        ]}
      >
        <Input prefix={<UserOutlined />} placeholder="Логин" />
      </Form.Item>
      <Form.Item
        name="password"
        rules={[
          {
            required: true,
            message: 'Пожалуйста введите свой пароль!',
          },
        ]}
      >
        <Input prefix={<LockOutlined />} type="password" placeholder="Пароль" />
      </Form.Item>
      <Form.Item>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Form.Item name="remember" valuePropName="checked" noStyle>
            <Checkbox>Оставаться в аккаунте</Checkbox>
          </Form.Item>
          <a href="">Забыл пароль</a>
        </div>
      </Form.Item>

      <Form.Item>
        <Button block type="primary" htmlType="submit" loading={loading}>
          Войти
        </Button>
        или <a href="">Зарегистрироваться!</a>
      </Form.Item>
    </Form>
  );
};

export default Login;
