import { Menu } from "antd";
import DataCard from "./components/DataCard";
import CriticalEventCard from "./components/CriticalEventCard";
import MainGraphic from "./components/MainGraphic";
import EquipmentData from "./components/EquipmentData";
import { Typography } from "antd";
const { Title } = Typography;

const items = [
  {
    key: "grp",
    label: "",
    type: "group",
    children: [
      {
        key: "1",
        label: "Статистка",
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
const App = () => {
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
          </div>
        </div>
        <div className="container my-10">
          <MainGraphic/>
        </div>
        <div className="mx-auto flex gap-5">
          <DataCard />
          <CriticalEventCard />
        </div>
      </div>
      <div>
        <EquipmentData/>
      </div>
    </div>
  );
};
export default App;
