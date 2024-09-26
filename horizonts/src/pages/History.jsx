import { DatePicker, TimePicker, Typography, Button } from "antd";
import React, { useState } from 'react';
import LeftMenu from "../components/LeftMenu"; // Import the left menu component
import HistoryTreeSelect from "../components/HistoryTreeSelect"; // Import the tree select component
import HistoryTable from "../components/HistoryTable"; // Import the table component
import dayjs from 'dayjs';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;
const { Title } = Typography;
const { RangePicker } = DatePicker;

const History = () => {
  const [selectedObjects, setSelectedObjects] = useState([]);
  const [dateRange, setDateRange] = useState([dayjs().subtract(2, 'day'), dayjs()]);
  const [timeRange, setTimeRange] = useState([dayjs('00:00', 'HH:mm'), dayjs('21:00', 'HH:mm')]);
  const [reportData, setReportData] = useState([]); // State to hold the report data

  const handleFilterApply = async () => {
    const [dateStart, dateEnd] = dateRange;
    const [timeStart, timeEnd] = timeRange;

    const filterRequestData = {
      objects: selectedObjects,
      date_start: dateStart.format('YYYY-MM-DD'),
      time_start: timeStart.format('HH:mm'),
      date_end: dateEnd.format('YYYY-MM-DD'),
      time_end: timeEnd.format('HH:mm'),
    };

    try {
      const response = await axios.post(`http://${apiUrl}/api/v1/report/history`, filterRequestData);
      setReportData(response.data.data); // Update the report data with the response
    } catch (error) {
      console.error('Error applying filters:', error);
    }
  };

  const handleGenerateReport = async () => {
    // Logic for generating report (e.g., downloading an Excel file)
    const [dateStart, dateEnd] = dateRange;
    const [timeStart, timeEnd] = timeRange;

    const reportRequestData = {
      objects: selectedObjects,
      date_start: dateStart.format('YYYY-MM-DD'),
      time_start: timeStart.format('HH:mm'),
      date_end: dateEnd.format('YYYY-MM-DD'),
      time_end: timeEnd.format('HH:mm'),
    };

    try {
      const response = await axios.post(`http://${apiUrl}/api/v1/report/`, reportRequestData, {
        responseType: 'blob', // Set response type for downloading file
      });

      // Create a URL for the downloaded file
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'Report.xlsx'); // Specify the file name
      document.body.appendChild(link);
      link.click();
      link.remove(); // Remove the link after download
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
                    onSelect={setSelectedObjects} // Update state when objects are selected
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
            <Button onClick={handleFilterApply}>Применить фильтр</Button>
            <Button onClick={handleGenerateReport} className="ml-2">Создать отчёт</Button>
          </div>
        </div>
        <br />
        <div>
          <HistoryTable reportData={reportData} /> {/* Pass report data to HistoryTable */}
        </div>
      </div>
    </div>
  );
};

export default History;
