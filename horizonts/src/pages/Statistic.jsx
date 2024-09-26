import React, { useState, useEffect } from "react";
// import { Menu } from "antd";
import DataDayCard from "../components/DataDayCard";
import CriticalEventCard from "../components/CriticalEventCard";
import MainGraphic from "../components/MainGraphic";
import FactoryButton from "../components/FactoryButton";
import LeftMenu from "../components/LeftMenu";
import EquipmentStatus from "../components/EquipmentStatus";
// import { Typography } from "antd";

const { Title } = Typography;


import { Menu, Dropdown, Button, Space, message, Typography } from 'antd';
import { DownOutlined, UserOutlined } from '@ant-design/icons';
import ReloadButton from "../components/ReloadButton";





const Statistic = () => {
  const [selectedFactoryId, setSelectedFactoryId] = useState("");

  const handleFactorySelect = (id) => {
    setSelectedFactoryId(id);
    console.log("Выбранный ID завода:", id);
  };



  return (
    <div className="flex">

      <LeftMenu />
      <div>
        <div className="mx-auto flex">
          <div className="mx-10 flex gap-4">
            <Title level={2}>Статистика</Title>
            <FactoryButton onSelect={handleFactorySelect} />
            
          </div>
        </div>
        <div className="pl-20">
          <div className="container my-20">
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
      <div style={{ marginTop: "200px", marginLeft: "50px" }}>
      <div>
            <ReloadButton/>
            </div>
        <EquipmentStatus factoryId={selectedFactoryId}/>
      </div>
    </div>
  );
};




export default Statistic;
