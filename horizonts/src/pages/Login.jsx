import React, { useState } from 'react';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Checkbox, Form, Input, Flex, message } from 'antd';

const Login = ({ setIsAuthenticated }) => {
  const onFinish = (values) => {
    const { username, password } = values;

    if (username === 'admin' && password === 'admin') {
      setIsAuthenticated(true); 
      message.success('Успешный вход!');
    } else {
      message.error('Неверный логин или пароль');
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
        <Flex justify="space-between" align="center">
          <Form.Item name="remember" valuePropName="checked" noStyle>
            <Checkbox>Оставаться в аккаунте</Checkbox>
          </Form.Item>
          <a href="">Забыл пароль</a>
        </Flex>
      </Form.Item>

      <Form.Item>
        <Button block type="primary" htmlType="submit">
          Войти
        </Button>
        или <a href="">Зарегистрироваться!</a>
      </Form.Item>
    </Form>
  );
};

export default Login;
