// EquipmentStatus.js
import React, { useState } from 'react';
import { Card, Select, Button, Collapse, Row, Col, Radio } from 'antd';
import { Line } from '@ant-design/plots';

const { Option } = Select;
const { Panel } = Collapse;

const EquipmentStatus = () => {
  const [selectedShop, setSelectedShop] = useState('Все');

  const equipmentData = [
    {
      id: 1,
      name: 'Оборудование 1',
      workTime: '5 часов',
      idleTime: '3 часа 15 минут',
      criticalEvents: 4,
      assignedTime: '2 часа',
      data: [/* mock data for the chart */]
    },
    {
      id: 2,
      name: 'Оборудование 2',
      workTime: '5 часов',
      idleTime: '3 часа 15 минут',
      criticalEvents: 4,
      assignedTime: '2 часа',
      data: [/* mock data for the chart */]
    },
    {
      id: 3,
      name: 'Оборудование 3',
      workTime: '5 часов',
      idleTime: '3 часа 15 минут',
      criticalEvents: 4,
      assignedTime: '2 часа',
      data: [/* mock data for the chart */]
    }
  ];

  const handleShopChange = (e) => {
    setSelectedShop(e.target.value);
  };

  const config = {
    data: [
      { time: '2024-08-10 10:00', value: 50 },
      { time: '2024-08-10 11:00', value: 55 },
      { time: '2024-08-10 12:00', value: 60 },
      { time: '2024-08-10 13:00', value: 70 },
      { time: '2024-08-10 14:00', value: 80 },
    ],
    height: 100,
    xField: 'time',
    yField: 'value',
    smooth: true,
    color: '#72b3f9',
  };

  return (
    <div style={{ padding: 24 }}>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          {/* Horizontal shop selection using Radio.Group */}
          <Radio.Group
            onChange={handleShopChange}
            value={selectedShop}
            style={{ marginBottom: 16 }}
            buttonStyle="solid"
          >
            <Radio.Button value="Все">Все</Radio.Button>
            <Radio.Button value="1">1</Radio.Button>
            <Radio.Button value="2">2</Radio.Button>
            <Radio.Button value="3">3</Radio.Button>
            <Radio.Button value="4">4</Radio.Button>
            <Radio.Button value="5">5</Radio.Button>
            <Radio.Button value="6">6</Radio.Button>
            <Radio.Button value="7">7</Radio.Button>
            <Radio.Button value="8">8</Radio.Button>
          </Radio.Group>
        </Col>
        {equipmentData.map((equipment) => (
          <Col span={24} key={equipment.id}>
            <Collapse>
              <Panel header={equipment.name} key={equipment.id}>
                <p>Время работы: {equipment.workTime}</p>
                <p>Время простоя: {equipment.idleTime}</p>
                <p>Критических событий: {equipment.criticalEvents}</p>
                <p>Назначенное время: {equipment.assignedTime}</p>
                <Line {...config} />
                <Button type="primary" style={{ marginTop: 16 }}>
                  Подробнее
                </Button>
              </Panel>
            </Collapse>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default EquipmentStatus;
