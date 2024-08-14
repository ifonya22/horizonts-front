import React, { useState, useEffect } from 'react';
import { Collapse, Row, Col, Radio, Button } from 'antd';
import { Line } from '@ant-design/plots';
import axios from 'axios';

const { Panel } = Collapse;

const EquipmentStatus = () => {
  const [selectedShop, setSelectedShop] = useState('Все');
  const [shopsData, setShopsData] = useState([]);
  const [equipmentData, setEquipmentData] = useState([]);

  useEffect(() => {
    // Загружаем данные для всех цехов при загрузке компонента
    const fetchData = async () => {
      const result = await axios.get('http://localhost:8000/api/v1/firm/1/workshops/');
      setShopsData(result.data.shops);  // Сохраняем данные о цехах
      setEquipmentData(result.data.shops);  // Показываем оборудование для всех цехов по умолчанию
    };
    fetchData();
  }, []);

  const handleShopChange = async (e) => {
    const shopId = e.target.value;
    setSelectedShop(shopId);

    if (shopId === 'Все') {
      const result = await axios.get('http://localhost:8000/api/v1/firm/1/workshops/');
      setEquipmentData(result.data.shops);
    } else {
      const result = await axios.get(`http://localhost:8000/api/v1/firm/1/${shopId}`);
      setEquipmentData([result.data]);
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Radio.Group
            onChange={handleShopChange}
            value={selectedShop}
            style={{ marginBottom: 16 }}
            buttonStyle="solid"
          >
            <Radio.Button value="Все">Все</Radio.Button>
            {shopsData.map(shop => (
              <Radio.Button key={shop.id} value={shop.id.toString()}>{shop.name}</Radio.Button>
            ))}
          </Radio.Group>
        </Col>
        {equipmentData.map((shop) => (
          shop.equipment.map((equipment) => (
            <Col span={24} key={equipment.id}>
              <Collapse>
                <Panel header={equipment.name} key={equipment.id}>
                  <p>Время работы: {equipment.workTime}</p>
                  <p>Время простоя: {equipment.idleTime}</p>
                  <p>Критических событий: {equipment.criticalEvents}</p>
                  <p>Назначенное время: {equipment.assignedTime}</p>
                  <Line {...{
                    data: equipment.data,
                    height: 100,
                    xField: 'time',
                    yField: 'value',
                    smooth: true,
                    color: '#72b3f9',
                  }} />
                  <Button type="primary" style={{ marginTop: 16 }}>
                    Подробнее
                  </Button>
                </Panel>
              </Collapse>
            </Col>
          ))
        ))}
      </Row>
    </div>
  );
};

export default EquipmentStatus;
