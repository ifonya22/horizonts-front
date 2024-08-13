import LeftMenu from "../components/LeftMenu";
import { Card, Typography, Button, Flex } from "antd";
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
                <div className="flex">
                <Title level={3}>Предприятия</Title>
                <Button >Добавить предприятие</Button>
                </div>
            </Card>
            </div>
            </div>
      </div>
    </div>
  );
};

export default Settings;
