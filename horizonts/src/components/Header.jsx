import React from 'react';
import { Layout, Menu, Dropdown, Typography } from 'antd';
import { UserOutlined, LogoutOutlined, ProfileOutlined } from '@ant-design/icons';

const { Header: AntHeader } = Layout;
const { Text } = Typography;

const userName = "Иван Иванов Иванович"; // ФИО пользователя

const menu = (
  <Menu>
    <Menu.Item key="profile" icon={<ProfileOutlined />}>
      Посмотреть профиль
    </Menu.Item>
    <Menu.Item key="logout" icon={<LogoutOutlined />}>
      Выйти из аккаунта
    </Menu.Item>
  </Menu>
);

const Header = () => {
  return (
    <AntHeader style={{ backgroundColor: '#f57838', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 20px' }}>
      <div>
        <Text style={{ color: '#fff', fontSize: '20px' }}>Название</Text>
      </div>
      <div>
        <Dropdown overlay={menu} trigger={['click']}>
          <a href="/" onClick={e => e.preventDefault()} style={{ color: '#fff' }}>
            {userName} <UserOutlined />
          </a>
        </Dropdown>
      </div>
    </AntHeader>
  );
};

export default Header;
