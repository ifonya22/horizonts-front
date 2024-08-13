import { Menu } from "antd";
import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

const LeftMenu = () => {
  const location = useLocation();
  const [selectedKey, setSelectedKey] = useState("");

  useEffect(() => {
    if (location.pathname === "/statistic") {
      setSelectedKey("1");
    } else if (location.pathname === "/history") {
      setSelectedKey("2");
    }

  }, [location.pathname]);

  const items = [
    {
      key: "grp",
    //   label: "Главное меню",
      type: "group",
      children: [
        {
          key: "1",
          label: <Link to="/statistic">Статистика</Link>,
        },
        {
          type: "divider",
        },
        {
          key: "2",
          label: <Link to="/history">История / Экспорт</Link>,
        },
        {
          type: "divider",
        },
        {
          key: "3",
          label: <Link to="/settings">Настройки</Link>,
        },
        {
          type: "divider",
        },
      ],
    },
  ];

  return (
    <Menu
      selectedKeys={[selectedKey]}
      style={{
        width: 256,
      }}
      mode="inline"
      items={items}
      className="h-screen"
    />
  );
};

export default LeftMenu;
