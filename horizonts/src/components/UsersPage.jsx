import React, { useState, useEffect } from 'react';
import { Button, Input, List, Space } from 'antd';
import axios from 'axios';

const UsersPage = () => {
  const [admins, setAdmins] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [newAdmin, setNewAdmin] = useState('');
  const [newEmployee, setNewEmployee] = useState('');

  useEffect(() => {
    axios.get('http://localhost:8000/api/v1/users/')
      .then(response => {
        setAdmins(response.data.users.admins);
        setEmployees(response.data.users.employees);
      })
      .catch(error => console.error('Error fetching users:', error));
  }, []);

  const handleAddAdmin = () => {
    if (newAdmin.trim() !== '') {
      setAdmins([...admins, { id: admins.length + 1, full_name: newAdmin, isadmin: 1, position: 'New Admin' }]);
      setNewAdmin('');
    }
  };

  const handleAddEmployee = () => {
    if (newEmployee.trim() !== '') {
      setEmployees([...employees, { id: employees.length + 1, full_name: newEmployee, isadmin: 0, position: 'New Employee' }]);
      setNewEmployee('');
    }
  };

  const handleRemoveAdmin = (id) => {
    setAdmins(admins.filter(admin => admin.id !== id));
  };

  const handleRemoveEmployee = (id) => {
    setEmployees(employees.filter(employee => employee.id !== id));
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Пользователи</h2>

      <div style={{ marginBottom: '20px' }}>
        <h3>Администраторы:</h3>
        <List
          dataSource={admins}
          renderItem={admin => (
            <List.Item
              actions={[<Button onClick={() => handleRemoveAdmin(admin.id)} type="text" danger>Удалить</Button>]}
            >
              <Space>
                {admin.full_name} ({admin.position})
              </Space>
            </List.Item>
          )}
        />
        <Input
          value={newAdmin}
          onChange={(e) => setNewAdmin(e.target.value)}
          placeholder="Введите имя администратора"
          style={{ width: 300, marginRight: 8 }}
        />
        <Button onClick={handleAddAdmin} type="primary">Добавить</Button>
      </div>

      <div>
        <h3>Сотрудники:</h3>
        <List
          dataSource={employees}
          renderItem={employee => (
            <List.Item
              actions={[<Button onClick={() => handleRemoveEmployee(employee.id)} type="text" danger>Удалить</Button>]}
            >
              <Space>
                {employee.full_name} ({employee.position})
              </Space>
            </List.Item>
          )}
        />
        <Input
          value={newEmployee}
          onChange={(e) => setNewEmployee(e.target.value)}
          placeholder="Введите имя сотрудника"
          style={{ width: 300, marginRight: 8 }}
        />
        <Button onClick={handleAddEmployee} type="primary">Добавить</Button>
      </div>
    </div>
  );
};

export default UsersPage;
