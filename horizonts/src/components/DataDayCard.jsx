import React, { useState, useEffect } from 'react';
import { Card, Space, Spin } from 'antd';
const DataDayCard = ({ factoryId }) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      console.log('Factory ID:', factoryId);
      if (factoryId) {
        const response = await fetch(`http://localhost:8000/api/v1/firm/${factoryId}`); // Замените на ваш URL
      const result = await response.json();
      setData(result);
      }
      
    };

    fetchData();
  }, [factoryId]);

  if (!data) {
    return (
      <Space direction="vertical" size={16}>
      <Card
        title={
          <div className='flex items-center'>
            <span className='mx-auto'>Данные предприятия за сутки</span>
          </div>
        }
        style={{
          width: 300,
        }}
      >
        <div>
        <Spin>Загрузка...</Spin>
        </div>
        
      </Card>
    </Space>
    ); 
  }

  return (
    <Space direction="vertical" size={16}>
      <Card className="shadow-md border border-gray-200"

        title={
          <div className='flex items-center gap-4'>
            <img src='https://via.placeholder.com/25' alt='Логотип' />
            <span className='mx-auto'>Данные предприятия за сутки</span>
          </div>
        }
        style={{
          width: 340,
        }}
      >
        <p className='font-sans'>Время работы: {data.work_time}</p>
        <p className='font-sans'>Время простоя: {data.downtime}</p>
        <p className='font-sans'>Критических событий: {data.critical_events}</p>
        <p className='font-sans'>Потребление эл. энергии: {data.energy_consumption}</p>
        <p className='font-sans'>Критическая мощность: {data.critical_power}</p>
      </Card>
    </Space>
  );
};

export default DataDayCard;
