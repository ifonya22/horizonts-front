import { Card, Space } from 'antd';
const DataCard = () => (
  <Space direction="vertical" size={16}>
    <Card
      title={
        <div className='flex items-center'>
            <img src=''/>
            <span className='mx-auto'>Данные предприятия за сутки</span>
        </div>
      }
      style={{
        width: 300,
      }}
    >
      <p className='font-weight-bold'>Время работы: </p>
      <p>Время простоя: </p>
      <p>Критических событий: </p>
      <p>Неопределенное время: </p>
      <p>Потребление эл. энергии: </p>
      <p>Критическая мощность: </p>
    </Card>
  </Space>
);
export default DataCard;