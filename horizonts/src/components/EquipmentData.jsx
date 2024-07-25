import { useState } from "react";
import { Button, Dropdown, Menu } from "antd";

const EquipmentData = () => {
  const [openDropdown, setOpenDropdown] = useState(null);

  const handleOpenChange = (index, flag) => {
    setOpenDropdown(flag ? index : null);
  };

  const menu = (
    <Menu>
      <Menu.Item>
        <div style={{ display: "flex", alignItems: "center" }}>
          <img
            src="https://via.placeholder.com/350" // Замените на URL вашего изображения
            alt="Sample"
            style={{ width: "auto", height: "auto", marginRight: "10px" }}
          />
          <span>
            <p>Время простоя: </p>
            <p>Критических событий: </p>
            <p>Неопределенное время: </p>
            <p>Потребление эл. энергии: </p>
            <p>Критическая мощность: </p>
            <Button
              style={{
                backgroundColor: "#fff",
                color: "#000",
                borderColor: "#d9d9d9",
              }}
            >
             Подробнее
            </Button>
          </span>
        </div>
      </Menu.Item>
    </Menu>
  );

  return (
    <div style={{ padding: "20px" }}>
      {[...Array(3)].map((_, index) => (
        <div key={index} style={{ marginBottom: "10px" }}>
          <Dropdown
            overlay={menu}
            trigger={["click"]}
            onOpenChange={(flag) => handleOpenChange(index, flag)}
            open={openDropdown === index}
          >
            <Button
              style={{
                backgroundColor: "#fff",
                color: "#000",
                borderColor: "#d9d9d9",
              }}
            >
              Агрегат {index + 1}
            </Button>
          </Dropdown>
          {openDropdown === index && (
            <div style={{ marginTop: "10px" }}>{menu}</div>
          )}
        </div>
      ))}
    </div>
  );
};

export default EquipmentData;
