import React, { useState } from 'react';
import { Modal, Button, Input, Tabs, Form, message } from 'antd';
import axios from 'axios';

const { TabPane } = Tabs;

const SettingsAddFirmModal = ({ isVisible, onClose }) => {
  const [form] = Form.useForm();
  const [workshops, setWorkshops] = useState([{ key: '1', name: '', equipment: [] }]);
  const [activeKey, setActiveKey] = useState('1');
  const [nextWorkshopKey, setNextWorkshopKey] = useState(2);

  // Добавление нового цеха
  const addWorkshop = () => {
    const newKey = nextWorkshopKey.toString();
    setWorkshops([...workshops, { key: newKey, name: '', equipment: [] }]);
    setActiveKey(newKey);
    setNextWorkshopKey(nextWorkshopKey + 1);
  };

  // Обновление названия цеха
  const updateWorkshopName = (key, name) => {
    setWorkshops(workshops.map(workshop => workshop.key === key ? { ...workshop, name } : workshop));
  };

  // Добавление нового оборудования в цех
  const addEquipment = (workshopKey) => {
    setWorkshops(workshops.map(workshop => 
      workshop.key === workshopKey 
        ? { ...workshop, equipment: [...workshop.equipment, { name: '', description: '' }] } 
        : workshop
    ));
  };

  // Обновление информации об оборудовании
  const updateEquipment = (workshopKey, index, field, value) => {
    setWorkshops(workshops.map(workshop => 
      workshop.key === workshopKey 
        ? {
            ...workshop,
            equipment: workshop.equipment.map((equip, i) => i === index ? { ...equip, [field]: value } : equip)
          }
        : workshop
    ));
  };

  // Отправка данных на сервер
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const payload = {
        firmName: values.firmName,
        workshops,
      };

      // Отправка данных на сервер
      await axios.post('http://localhost:8000/api/v1/firm/add', payload, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Успешное выполнение запроса
      message.success('Предприятие успешно добавлено!');
      onClose();
    } catch (error) {
      // Обработка ошибок
      console.error('Ошибка при добавлении предприятия:', error);
      message.error('Ошибка при добавлении предприятия. Пожалуйста, попробуйте еще раз.');
    }
  };

  return (
    <Modal
      title={`Создание предприятия`}
      visible={isVisible}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>Отмена</Button>,
        <Button key="submit" type="primary" onClick={handleSubmit}>Добавить предприятие</Button>
      ]}
      width={800}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="Введите название предприятия"
          name="firmName"
          rules={[{ required: true, message: 'Введите название предприятия' }]}
        >
          <Input placeholder="Название предприятия" />
        </Form.Item>
        <Tabs 
          activeKey={activeKey} 
          onChange={setActiveKey} 
          type="editable-card"
          onEdit={(targetKey, action) => action === 'add' && addWorkshop()}
        >
          {workshops.map(workshop => (
            <TabPane tab={`Цех ${workshop.key}`} key={workshop.key} closable={false}>
              <Form.Item
                label={`Название цеха ${workshop.key}`}
                rules={[{ required: true, message: 'Введите название цеха' }]}
              >
                <Input 
                  placeholder="Название цеха" 
                  value={workshop.name}
                  onChange={(e) => updateWorkshopName(workshop.key, e.target.value)}
                />
              </Form.Item>
              {workshop.equipment.map((equip, index) => (
                <div key={index} style={{ marginBottom: '20px' }}>
                  <Form.Item label={`Название оборудования ${index + 1}`}>
                    <Input 
                      placeholder="Название оборудования"
                      value={equip.name}
                      onChange={(e) => updateEquipment(workshop.key, index, 'name', e.target.value)}
                    />
                  </Form.Item>
                  <Form.Item label={`Описание оборудования ${index + 1}`}>
                    <Input 
                      placeholder="Описание оборудования"
                      value={equip.description}
                      onChange={(e) => updateEquipment(workshop.key, index, 'description', e.target.value)}
                    />
                  </Form.Item>
                </div>
              ))}
              <Button type="dashed" onClick={() => addEquipment(workshop.key)}>Добавить оборудование</Button>
            </TabPane>
          ))}
        </Tabs>
      </Form>
    </Modal>
  );
};

export default SettingsAddFirmModal;
