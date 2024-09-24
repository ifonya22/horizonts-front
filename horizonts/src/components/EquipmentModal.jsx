import React from 'react';
import { Modal, Row, Col } from 'antd';
import { Line } from '@ant-design/plots';

const EventHistory = ({ events }) => {
  // Преобразуем секунды в формат времени
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  return (
    <Col span={12}>
      <h3>История событий:</h3>
      <ul>
        {events.map((event, index) => (
          <li key={index}>
            {formatTime(event[0])} - {formatTime(event[1])} : {event[2]}
          </li>
        ))}
      </ul>
    </Col>
  );
};

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
          <Line
            data={equipment.data}
            height={200}
            xField="time"
            yField="value"
            smooth
            color="#72b3f9"
          />
        </Col>
        <Col span={12}>
          <p>Номинальная мощность: 1000 кВт</p>
          <p>Холостой ход: 20%</p>
          <p>Время работы: {equipment.workTime}</p>
          <p>Время простоя: {equipment.idleTime}</p>
          <p>Критических событий: {equipment.criticalEvents}</p>
        </Col>
        {/* <EventHistory events={equipment.criticalEventsList} /> */}
      </Row>
    </Modal>
  );
};

export default EquipmentModal;
