import React, { useState, useEffect } from "react";
// import { Menu } from "antd";
import DataDayCard from "../components/DataDayCard";
import CriticalEventCard from "../components/CriticalEventCard";
import MainGraphic from "../components/MainGraphic";
import EquipmentData from "../components/EquipmentData";
import FactoryButton from "../components/FactoryButton";
// import { Typography } from "antd";

const { Title } = Typography;

const items = [
  {
    key: "grp",
    label: "",
    type: "group",
    children: [
      {
        key: "1",
        label: "Статистика",
      },
      {
        type: "divider",
      },
      {
        key: "2",
        label: "Настройки",
      },
      {
        type: "divider",
      },
    ],
  },
];

import { Menu, Dropdown, Button, Space, message, Typography } from 'antd';
import { DownOutlined, UserOutlined } from '@ant-design/icons';





const Statistic = () => {
  const [selectedFactoryId, setSelectedFactoryId] = useState("");

  const handleFactorySelect = (id) => {
    setSelectedFactoryId(id);
    console.log("Выбранный ID завода:", id);
  };

  const onClick = (e) => {
    console.log("click ", e);
  };

  return (
    <div className="flex">
      <Menu
        onClick={onClick}
        style={{
          width: 256,
        }}
        defaultSelectedKeys={["1"]}
        defaultOpenKeys={["sub1"]}
        mode="inline"
        items={items}
        className="h-screen"
      />
  
      <div>
        <div className="mx-auto flex">
          <div className="mx-10 flex gap-4">
            <Title level={2}>Статистика</Title>
            <FactoryButton onSelect={handleFactorySelect} />
          </div>
        </div>
        <div className="pl-10">
          <div className="container my-10">
            <MainGraphic factoryId={selectedFactoryId} />
          </div>
          <div className="mx-auto flex gap-20 mt-16">
            <div style={{ marginRight: "50px" }}>
              <DataDayCard factoryId={selectedFactoryId}  />
            </div>
            <div>
              <CriticalEventCard factoryId={selectedFactoryId} />
            </div>
          </div>
        </div>
      </div>
      {/* <div style={{ marginTop: "200px", marginLeft: "50px" }}>
        <EquipmentData />
      </div> */}
    </div>
  );
};




export default Statistic;
