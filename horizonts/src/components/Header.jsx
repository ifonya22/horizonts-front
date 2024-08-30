import React from 'react';
import { Layout, Menu, Dropdown, Typography } from 'antd';
import { UserOutlined, LogoutOutlined, ProfileOutlined } from '@ant-design/icons';

const { Header: AntHeader } = Layout;
const { Text } = Typography;

const Header = ({ setIsAuthenticated, userFullName }) => {
  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('access_token');
    setIsAuthenticated(false);
    window.location.href = '/';
  };

  const menu = (
    <Menu>
      <Menu.Item key="profile" icon={<ProfileOutlined />}>
        Посмотреть профиль
      </Menu.Item>
      <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout}>
        Выйти из аккаунта
      </Menu.Item>
    </Menu>
  );

  return (
    <AntHeader style={{ backgroundColor: '#f57838', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 20px' }}>
      <div>
        <Text style={{ color: '#fff', fontSize: '26px' }}>Мониторинг электроэнергии</Text>
      </div>
      <div>
        {userFullName && (
          <Dropdown overlay={menu} trigger={['click']}>
            <a href="/" onClick={e => e.preventDefault()} style={{ color: '#fff' }}>
              {userFullName} <UserOutlined />
            </a>
          </Dropdown>
        )}
      </div>
    </AntHeader>
  );
};

export default Header;
