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

const fetchData = async () => {
  const response = await fetch('http://localhost:8000/api/v1/statistic/last_hour', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      factory_id: 0,
      start_date: "2024-05-18",
      end_date: "2024-05-18",
    }),
  });

  const data = await response.json();
  return data.last_hour;
};

const transformData = (data) => {
  return data.map(item => ({
    name: item.minute, // Используем минуту как имя для оси X
    "Реальные данные": item.total_capacity,
  }));
};

const MainGraphic = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      const apiData = await fetchData();
      const transformedData = transformData(apiData);
      setData(transformedData);
    };

    loadData();
  }, []);

  return (
    <div
      style={{
        border: "1px solid gray",
        padding: "10px",
        borderRadius: "5px",
        width: "80%",
        height: "400px",
      }}
    >
      <ResponsiveContainer width="100%" height="100%">
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
