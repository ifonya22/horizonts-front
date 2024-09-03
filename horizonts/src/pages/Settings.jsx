import React, { useState } from "react";
import LeftMenu from "../components/LeftMenu";
import { Card, Typography, Button, Flex } from "antd";
import FirmsList from "../components/FirmsList";
import UsersPage from "../components/UsersPage";
import SettingsAddFirmModal from "../components/SettingsAddFirmModal";

const { Title } = Typography;

const Settings = () => {
  const [selectedTab, setSelectedTab] = useState("firms");
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <div className="flex">
      <LeftMenu />

      <div className="w-3/4 px-5">
        <div>
          <Title level={2}>Настройки</Title>
        </div>
        <div className="flex">
          <div>
            <Flex
              vertical
              gap="small"
              style={{
                width: "150px",
              }}
            >
              <div className="my-4">
                <Button block onClick={() => setSelectedTab("users")}>Пользователи</Button>
              </div>
              <div>
                <Button block onClick={() => setSelectedTab("firms")}>Предприятия</Button>
              </div>
            </Flex>
          </div>
          <div>
            <Card
              style={{
                width: 800,
              }}
            >
              {selectedTab === "firms" ? (
                <div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Title level={3}>Предприятия</Title>
                    <Button onClick={showModal}>Добавить предприятие</Button> {/* Обновлено */}
                  </div>
                  <FirmsList />
                  <SettingsAddFirmModal
                    isVisible={isModalVisible}
                    onClose={handleCancel}
                  />
                </div>
              ) : (
                <UsersPage />
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
