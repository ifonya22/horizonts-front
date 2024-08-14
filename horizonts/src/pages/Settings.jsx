import LeftMenu from "../components/LeftMenu";
import { Card, Typography, Button, Flex } from "antd";
import FirmsList from "../components/FirmsList";

const { Title } = Typography;
const Settings = () => {
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
                <Button block>Пользователи</Button>
                </div>
                <div>
                <Button block>Предприятия</Button>
                </div>
            </Flex>
            </div>
            <div>
            <Card
                style={
                {
                      width: 800,
                }
                }
            >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Title level={3}>Предприятия</Title>
                  </div>
                <div className="ml-auto">
                <Button >Добавить предприятие</Button>
                </div>
                
                </div>
                <div>
                  <FirmsList />
                </div>
            </Card>
            </div>
            </div>
      </div>
    </div>
  );
};

export default Settings;
