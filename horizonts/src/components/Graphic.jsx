import { PureComponent } from "react";
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

const data = [
  {
    name: "дата A",
    "Реальные данные": 4000,
    "Прогноз": 2400,
    amt: 2400,
  },
  {
    name: "дата B",
    "Реальные данные": 3000,
    "Прогноз": 1398,
    amt: 2210,
  },
  {
    name: "дата C",
    "Реальные данные": 2000,
    "Прогноз": 9800,
    amt: 2290,
  },
  {
    name: "дата D",
    "Реальные данные": 2780,
    "Прогноз": 3908,
    amt: 2000,
  },
  {
    name: "дата E",
    "Реальные данные": 1890,
    "Прогноз": 4800,
    amt: 2181,
  },
  {
    name: "дата F",
    "Реальные данные": 2390,
    "Прогноз": 3800,
    amt: 2500,
  },
  {
    name: "дата G",
    "Реальные данные": 3490,
    "Прогноз": 4300,
    amt: 2100,
  },
  {
    name: "дата H",
    
    "Прогноз": 4500,
    amt: 2100,
  },
  {
    name: "дата Q",
    
    "Прогноз": 4600,
    amt: 2100,
  },
];

export default class Graphic extends PureComponent {
  render() {
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
            <Line type="monotone" dataKey="Прогноз" stroke="#82ca9d" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  }
}
