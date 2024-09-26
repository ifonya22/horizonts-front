import React, { useEffect, useState } from 'react';
import { DownOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Dropdown, message, Space } from 'antd';

const apiUrl = import.meta.env.VITE_API_URL;
const handleMenuClick = (key, label, setSelectedFactory, onSelect) => {
    message.info(`Выбрано: ${label}`);
    setSelectedFactory(label);
    onSelect(key);
  };
  
  const FactoryButton = ({ onSelect }) => {
    const [factories, setFactories] = useState([]);
    const [selectedFactory, setSelectedFactory] = useState('');
  
    useEffect(() => {
      const fetchFactories = async () => {
        try {
          const username = localStorage.getItem('username');
          const response = await fetch(`http://${apiUrl}/api/v1/firm/get_all_factories/`, {headers: {'Username': username}});
          const data = await response.json();
  
          if (data.id_f.length > 0) {
            const factoryItems = data.id_f.map((id_f, index) => ({
              label: data.short_f[index],
              key: id_f.toString(),
              icon: <UserOutlined />,
            }));
            setFactories(factoryItems);
            const initialFactory = factoryItems[0];
            setSelectedFactory(initialFactory.label); 
            onSelect(initialFactory.key); 
          } else {
            message.warning('Нет доступных заводов');
          }
        } catch (error) {
          message.error('Ошибка при загрузке данных');
          console.error('Fetch error:', error);
        }
      };
  
      fetchFactories();
    }, []); // Пустой массив зависимостей для выполнения эффекта только один раз при монтировании
  
    const menuItems = factories.map(factory => ({
      label: factory.label,
      key: factory.key,
      icon: factory.icon,
      onClick: () => handleMenuClick(factory.key, factory.label, setSelectedFactory, onSelect),
    }));
  
    const menuProps = {
      items: menuItems,
    };
  
    return (
      <Space wrap>
        <Dropdown menu={menuProps}>
          <Button>
            <Space>
              {selectedFactory || 'Выбрать завод'}
              <DownOutlined />
            </Space>
          </Button>
        </Dropdown>
      </Space>
    );
  };

export default FactoryButton;
