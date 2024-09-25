import { DatePicker, TimePicker, Typography, Button } from "antd";
import React, { useState } from 'react';
import LeftMenu from "../components/LeftMenu"; // Импортируем меню из файла
import HistoryTreeSelect from "../components/HistoryTreeSelect"; // Импортируем новый компонент
import HistoryTable from "../components/HistoryTable";
import dayjs from 'dayjs';
import axios from 'axios';

const { Title } = Typography;
const { RangePicker } = DatePicker;

const History = () => {
  const [selectedObjects, setSelectedObjects] = useState([]);
  const [dateRange, setDateRange] = useState([dayjs().subtract(2, 'day'), dayjs()]);
  const [timeRange, setTimeRange] = useState([dayjs('00:00', 'HH:mm'), dayjs('21:00', 'HH:mm')]);

  const handleGenerateReport = async () => {
    const [dateStart, dateEnd] = dateRange;
    const [timeStart, timeEnd] = timeRange;
  
    const reportData = {
      objects: selectedObjects,
      date_start: dateStart.format('YYYY-MM-DD'),
      time_start: timeStart.format('HH:mm'),
      date_end: dateEnd.format('YYYY-MM-DD'),
      time_end: timeEnd.format('HH:mm'),
    };
  
    try {
      const response = await axios.post('http://localhost:8000/api/v1/report/', reportData, {
        responseType: 'blob', // Устанавливаем тип ответа
      });
  
      // Создаем URL для скачивания файла
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'Report.xlsx'); // Указываем имя файла
      document.body.appendChild(link);
      link.click();
      link.remove(); // Удаляем элемент после скачивания
    } catch (error) {
      console.error('Error generating report:', error);
    }
  };
  
  return (
    <div className="flex">
      <LeftMenu />
      <div className="w-3/4 px-5">
        <div>
          <Title level={2}>История событий</Title>
        </div>
        <div className="flex items-center justify-between mt-4">
          <table className="border-separate border-spacing-4">
            <tr>
              <td>
                <div>Предприятие и оборудование</div>
                <br />
                <div>
                  <HistoryTreeSelect 
                    onSelect={setSelectedObjects} // Обновляем состояние при выборе объектов
                  />
                </div>
              </td>
              <td>
                <div>Дата</div>
                <br />
                <div>
                  <RangePicker 
                    defaultValue={dateRange} 
                    onChange={(dates) => setDateRange(dates)} 
                  />
                </div>
              </td>
              <td>
                <div>Время</div>
                <br />
                <div>
                  <TimePicker.RangePicker 
                    format="HH:mm" 
                    value={timeRange} 
                    onChange={(times) => setTimeRange(times)} 
                  />
                </div>
              </td>
            </tr>
          </table>
          <div className="ml-4">
            <Button onClick={handleGenerateReport}>Создать отчёт</Button>
          </div>
        </div>
        <br />
        <div>
          <HistoryTable />
        </div>
      </div>
    </div>
  );
};

export default History;

