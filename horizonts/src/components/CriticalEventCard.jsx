import { Card, Space } from 'antd';
const CriticalEventCard = () => (
  <Space direction="vertical" size={16}>
    <Card
      title={
        <div className='flex items-center'>
            <img src=''/>
            <span className='mx-auto'>Критические события</span>
        </div>
      }
      style={{
        width: 400,
      }}
    >
      <p>Время Причина Уведомления </p>
      <p>Время простоя: </p>
    </Card>
  </Space>
);
export default CriticalEventCard;