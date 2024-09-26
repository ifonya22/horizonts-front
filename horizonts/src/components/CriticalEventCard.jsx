import React, { useState, useEffect } from 'react';
import { Card, Space } from 'antd';

const apiUrl = import.meta.env.VITE_API_URL;
const CriticalEventCard = ({ factoryId }) =>  {
  const [data, setData] = useState({ start_stu: [], end_stu: [], is_notified_stu: [] });

  useEffect(() => {
    const fetchData = async () => {
      if (factoryId) {
      const response = await fetch(`http://${apiUrl}/api/v1/firm/${factoryId}/critical`); 
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
            <span className='mx-auto'>Критическиеfff события</span>
          </div>
        }
        style={{ width: 400 }}
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
  <Card
    className="shadow-md border border-gray-200"
    title={
      <div className='flex items-center'>
        <img src='./danger.png' alt='Логотип' className="w-10 h-10 mr-2" />
        <span className='mx-auto'>Критические события за сутки</span>
      </div>
    }
    style={{ width: 400 }}
  >
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Время начала</th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Время конца</th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Уведомления</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.start_stu.map((time, index) => (
            <tr key={index}>
              <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">{time}</td>
              <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">{data.end_stu[index]}</td>
              <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">{data.is_notified_stu[index]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </Card>
</Space>
);
};

export default CriticalEventCard;