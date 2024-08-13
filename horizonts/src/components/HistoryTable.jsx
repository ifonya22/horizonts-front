import React from "react";
import { Card, Table, Tag } from "antd";
const columns = [
  {
    title: "Время",
    dataIndex: "time",
    key: "time",
    render: (text) => <a>{text}</a>,
  },
  {
    title: "Дата",
    dataIndex: "date",
    key: "date",
  },
  {
    title: "Предприятие",
    dataIndex: "firm",
    key: "firm",
  },
  {
    title: "Описание",
    key: "description",
    dataIndex: "description",
  },
  {
    title: "Тип",
    key: "type",
    dataIndex: "type",
  },
  {
    title: "Показатель",
    key: "energy_consumption",
    dataIndex: "energy_consumption",
  },
  {
    title: "Причина",
    key: "reason",
    dataIndex: "reason",
  },
  {
    title: "Уведомление",
    key: "notification",
    dataIndex: "notification",
  },
];
const data = [
  {
    key: "1",
    name: "John Brown",
    age: 32,
    address: "New York No. 1 Lake Park",
    tags: ["nice", "developer"],
  },
  {
    key: "2",
    name: "Jim Green",
    age: 42,
    address: "London No. 1 Lake Park",
    tags: ["loser"],
  },
  {
    key: "3",
    name: "Joe Black",
    age: 32,
    address: "Sydney No. 1 Lake Park",
    tags: ["cool", "teacher"],
  },
  {
    key: "4",
    name: "Joe Black",
    age: 32,
    address: "Sydney No. 1 Lake Park",
    tags: ["cool", "teacher"],
  },
  {
    key: "5",
    name: "Joe Black",
    age: 32,
    address: "Sydney No. 1 Lake Park",
    tags: ["cool", "teacher"],
  },
];
const HistoryTable = () => {
  return (
    <div>
      <Card
        style={{
        //   width: 300,
        }}
      >
        <Table columns={columns} dataSource={data} />
      </Card>
    </div>
  );
};
export default HistoryTable;
