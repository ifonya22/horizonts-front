import React from 'react';
import { Modal, Row, Col } from 'antd';
import { Line } from '@ant-design/plots';

const EquipmentModal = ({ isVisible, onClose, equipment }) => {
  return (
    <Modal
      title={`Оборудование ${equipment.name}`}
      visible={isVisible}
      onCancel={onClose}
      footer={null}
      width={800}
    >
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Line {...{
            data: equipment.data,
            height: 200,
            xField: 'time',
            yField: 'value',
            smooth: true,
            color: '#72b3f9',
          }} />
        </Col>
        <Col span={12}>
          <p>Номинальная мощность: 1000 кВт</p>
          <p>Холостой ход: 20%</p>
          <p>Подготовительное время: 20%</p>
          <p>Время работы: {equipment.workTime}</p>
          <p>Время простоя: {equipment.idleTime}</p>
          <p>Критических событий: {equipment.criticalEvents}</p>
          <p>Назначенное время: {equipment.assignedTime}</p>
        </Col>
        <Col span={12}>
          <h3>История событий:</h3>
          <ul>
            <li>09:45 - Непредвиденное событие</li>
            <li>09:50 - Простой</li>
            <li>10:00 - Непредвиденное событие</li>
          </ul>
        </Col>
      </Row>
    </Modal>
  );
};

export default EquipmentModal;
