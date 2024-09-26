import React, { useState, useEffect } from 'react';
import { Collapse, Row, Col, Radio, Button } from 'antd';
import { Line } from '@ant-design/plots';
import axios from 'axios';
import EquipmentModal from './EquipmentModal'; 

const { Panel } = Collapse;
const apiUrl = import.meta.env.VITE_API_URL;

const EquipmentStatus = ({factoryId}) => {
  const [selectedShop, setSelectedShop] = useState('Все');
  const [shopsData, setShopsData] = useState([]);
  const [equipmentData, setEquipmentData] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (factoryId) {
      const username = localStorage.getItem('username');
      console.log("ale:", username)
      const result = await axios.get(`http://${apiUrl}/api/v1/firm/${factoryId}/workshops/`, {headers: {'Username': username}});
      setShopsData(result.data.shops);
      setEquipmentData(result.data.shops);}
    };
    fetchData();
  }, [factoryId]);

  const handleShopChange = async (e) => {
    const shopId = e.target.value;
    setSelectedShop(shopId);

    if (shopId === 'Все') {
      const username = localStorage.getItem('username');
      console.log("ale:", username)
      const result = await axios.get(`http://${apiUrl}/api/v1/firm/${factoryId}/workshops/`, {headers: {'Username': username}});

      setEquipmentData(result.data.shops);
    } else {
      const result = await axios.get(`http://${apiUrl}/api/v1/firm/${factoryId}/${shopId}`);
      setEquipmentData([result.data]);
    }
  };

  const showModal = (equipment) => {
    setSelectedEquipment(equipment);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedEquipment(null);
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
                  
                  <Line {...{
                    data: equipment.data,
                    height: 100,
                    xField: 'time',
                    yField: 'value',
                    smooth: true,
                    color: '#72b3f9',
                  }} />
                  <Button type="primary" style={{ marginTop: 16 }} onClick={() => showModal(equipment)}>
                    Подробнее
                  </Button>
                </Panel>
              </Collapse>
            </Col>
          ))
        ))}
      </Row>

      {selectedEquipment && (
        <EquipmentModal
          isVisible={isModalVisible}
          onClose={handleCancel}
          equipment={selectedEquipment}
        />
      )}
    </div>
  );
};

export default EquipmentStatus;
