import React from 'react';
import { Modal, Row, Col } from 'antd';

const SettingsAddFirmModal = ({ isVisible, onClose }) => {
  return (
    <Modal
      title={`TEST MODAL`}
      visible={isVisible}
      onCancel={onClose}
      footer={null}
      width={800}
    >

    </Modal>
  );
};

export default SettingsAddFirmModal;
