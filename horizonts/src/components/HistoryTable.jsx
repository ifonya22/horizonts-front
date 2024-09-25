import React from "react";
import { Card, Table, ConfigProvider } from "antd";

const columns = [
  {
    title: "Название цеха",
    dataIndex: "workshop_name",
    key: "workshop_name",
  },
  {
    title: "Дата",
    dataIndex: "event_date",
    key: "event_date",
  },
  {
    title: "Время",
    dataIndex: "event_time_start",
    key: "event_time_start",
    render: (text) => <span>{text}</span>,
  },
  {
    title: "Статус",
    dataIndex: "status",
    key: "status",
  },
  {
    title: "Показатель",
    dataIndex: "value",
    key: "value",
  },
];

const HistoryTable = ({ reportData }) => {
  // Add a unique key to each item
  const dataSource = reportData.map((item, index) => ({
    key: index + 1, // Unique key for each item
    ...item, // Spread the rest of the properties
  }));

  return (
    <div>
      <Card>
        <ConfigProvider
          theme={{
            components: {
              Table: {
                rowSelectedHoverBg: '#fff',
              },
            },
          }}
        >
          <Table columns={columns} dataSource={dataSource} />
        </ConfigProvider>
      </Card>
    </div>
  );
};

export default HistoryTable;
