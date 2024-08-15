import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title as ChartTitle,
  Tooltip as ChartTooltip,
  Legend as ChartLegend,
} from "chart.js";
import zoomPlugin from "chartjs-plugin-zoom"; // Импорт плагина для зума и панорамирования
import { DatePicker, message } from "antd";
const { RangePicker } = DatePicker;
import { Typography } from "antd";

const { Title } = Typography;

// Регистрируем все необходимые компоненты Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ChartTitle,
  ChartTooltip,
  ChartLegend,
  zoomPlugin // Регистрируем плагин для зума и панорамирования
);

const onOk = (value) => {
  console.log("onOk: ", value);
};

const fetchData = async (factoryId) => {
  try {
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split("T")[0];
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
      prediction: data.prediction,
    };
  } catch (error) {
    message.error(`Ошибка при загрузке данных: ${error.message}`);
    console.error("Fetch error:", error);
    return {
      lastHour: [],
      prediction: [],
    };
  }
};

const transformData = (data) => {
  const { lastHour, prediction } = data;

  const mergedData = {};

  lastHour.forEach((item) => {
    mergedData[item.minute] = {
      name: item.minute,
      realData: item.total_capacity,
      prediction: null 
    };
  });

  prediction.forEach((item) => {
    if (mergedData[item.minute]) {
      mergedData[item.minute].prediction = item.total_capacity;
    } else {
      mergedData[item.minute] = {
        name: item.minute,
        realData: null, 
        prediction: item.total_capacity
      };
    }
  });

  // Преобразуем данные в массив и сортируем
  const sortedData = Object.values(mergedData).sort((a, b) => {
    // Преобразование времени в формат, который можно сравнивать
    const [aHour, aMinute] = a.name.split(":").map(Number);
    const [bHour, bMinute] = b.name.split(":").map(Number);

    return aHour !== bHour ? aHour - bHour : aMinute - bMinute;
  });

  return sortedData;
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

  const chartData = {
    labels: data.map((item) => item.name),
    datasets: [
      {
        label: "Реальные данные",
        data: data.map((item) => item.realData),
        borderColor: "#8884d8",
        fill: false,
      },
      {
        label: "Прогноз",
        data: data.map((item) => item.prediction),
        borderColor: "#82ca9d",
        fill: false,
      },
    ],
  };


  const chartOptions = {
    responsive: true,
    plugins: {
      zoom: {
        pan: {
          enabled: true,
          mode: "xy", // Панорамирование как по X, так и по Y осям
        },
        zoom: {
          enabled: true,
          mode: "xy", // Зумирование как по X, так и по Y осям
          speed: 0.1, // Скорость зума
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Время",
        },
      },
      y: {
        title: {
          display: true,
          text: "Потребление",
        },
      },
    },
  };
  

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

      <Line data={chartData} options={chartOptions} />
    </div>
  );
};

export default MainGraphic;
