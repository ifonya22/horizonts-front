import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { DatePicker, Space, message } from 'antd';
const { RangePicker } = DatePicker;
import { Typography } from "antd";
const { Title } = Typography;

const onOk = (value) => {
  console.log('onOk: ', value);
};

const fetchData = async (factoryId) => {
  try {
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split('T')[0];
    console.log(formattedDate);

    const response = await fetch(
      "http://localhost:8000/api/v1/statistic/last_hour",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          factory_id: factoryId,
          start_date: formattedDate,
          end_date: "2024-07-26",
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();
    return {
      lastHour: data.last_hour,
      prediction: data.prediction
    };
  } catch (error) {
    message.error(`Ошибка при загрузке данных: ${error.message}`);
    console.error('Fetch error:', error);
    return {
      lastHour: [],
      prediction: []
    };
  }
};

const transformData = (data) => {
  const { lastHour, prediction } = data;


  const mergedData = {};

  lastHour.forEach((item) => {
    mergedData[item.minute] = {
      name: item.minute,
      "Реальные данные": item.total_capacity,
      "Прогноз": null 
    };
  });

  prediction.forEach((item) => {
    if (mergedData[item.minute]) {
      mergedData[item.minute]["Прогноз"] = item.total_capacity;
    } else {
      mergedData[item.minute] = {
        name: item.minute,
        "Реальные данные": null, 
        "Прогноз": item.total_capacity
      };
    }
  });

  return Object.values(mergedData);
};

const MainGraphic = ({ factoryId }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      if (factoryId) {
        const apiData = await fetchData(factoryId);
        const transformedData = transformData(apiData);
        setData(transformedData);
      }
    };

    loadData();
  }, [factoryId]);

  return (
    <div
      className="shadow-md border border-gray-200"
      style={{
        padding: "10px",
        borderRadius: "5px",
        width: "850px",
        height: "420px",
      }}
    >
      <div>
        <Title level={5} className="text-center">
          График потребления эл. энергии за последний час
        </Title>
      </div>
      
      <ResponsiveContainer width="100%" height="80%" style={{ marginTop: "20px" }}>
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="Реальные данные"
            stroke="#8884d8"
            activeDot={{ r: 8 }}
          />
          <Line
            type="monotone"
            dataKey="Прогноз"
            stroke="#82ca9d"
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MainGraphic;
