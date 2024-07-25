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
          start_date: "2024-07-25",
          end_date: "2024-07-26",
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();
    return data.last_hour;
  } catch (error) {
    message.error(`Ошибка при загрузке данных: ${error.message}`);
    console.error('Fetch error:', error);
    return [];
  }
};

const transformData = (data) => {
  return data.map((item) => ({
    name: item.minute,
    "Реальные данные": item.total_capacity,
  }));
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
      {/* <div className="mx-20 flex gap-10 margin-bottom">
        <RangePicker
          showTime={{
            format: "HH:mm",
          }}
          format="YYYY-MM-DD HH:mm"
          onChange={(value, dateString) => {
            console.log("Selected Time: ", value);
            console.log("Formatted Selected Time: ", dateString);
          }}
          onOk={onOk}
        />
      </div> */}

      <div>
        <Title level={5} className="text-center">График потребления эл. энергии за последний час</Title>

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
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MainGraphic;
