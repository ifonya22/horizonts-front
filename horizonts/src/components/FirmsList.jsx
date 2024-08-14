import React, { useEffect, useState } from 'react';
import { Button, Modal, message } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
// import { useNavigate } from 'react-router-dom';
// const navigate = useNavigate();

const FirmsList = () => {
  const [buttons, setButtons] = useState([]);
  const [visible, setVisible] = useState(false);
  const [buttonToDelete, setButtonToDelete] = useState(null);


  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('http://localhost:8000/api/v1/firm/get_all_factories/');
      const data = await response.json();
      const combinedButtons = data.short_f.map((short, index) => ({
        short,
        long: data.long_f[index],
        id: data.id_f[index]
      }));
      setButtons(combinedButtons);
    };

    fetchData();
  }, []);

//   const handleRedirect = (longName) => {
//     navigate(`/redirect/${longName}`);
//   };

  const showDeleteConfirm = (shortName) => {
    setButtonToDelete(shortName);
    setVisible(true);
  };

  const handleDelete = () => {
    // TODO: Добавить удаление завода из базы данных
    setButtons(buttons.filter(button => button.short !== buttonToDelete));
    setVisible(false);
    message.success(`"${buttonToDelete}" удален.`);
  };

  const handleCancel = () => {
    setVisible(false);
    setButtonToDelete(null);
  };

  return (
    <div>
  {buttons.map((button) => (
    <Button 
      key={button.id} 
      style={{ 
        margin: '10px 0',
        width: '100%'
      }} 
      onClick={() => handleRedirect(button.long)}
    >
      {button.long}
      <CloseOutlined 
        style={{ marginLeft: '8px' }} 
        onClick={(e) => {
          e.stopPropagation();
          showDeleteConfirm(button.long);
        }} 
      />
    </Button>
  ))}

  <Modal
    title="Подтверждение удаления"
    visible={visible}
    onOk={handleDelete}
    onCancel={handleCancel}
  >
    <p>Вы действительно хотите удалить "{buttonToDelete}"?</p>
  </Modal>
</div>

  );
};

export default FirmsList;
