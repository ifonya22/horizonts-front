import { DatePicker, TimePicker, Typography, Button } from "antd";
const { RangePicker } = DatePicker;
import LeftMenu from "../components/LeftMenu"; // Импортируем меню из файла
import FactoryButton from "../components/FactoryButton";
import HistoryTable from "../components/HistoryTable";
const { Title } = Typography;

const History = () => {
  return (
    <div className="flex">
      <LeftMenu />

      <div className="w-3/4 px-5">
        <div>
          <Title level={2}>История событий</Title>
        </div>
        <div className="flex items-center justify-between mt-4">
          <table className="border-separate border-spacing-4">
            <tr>
              <td>
                <div>Предприятие</div>
                <br />
                <div>
                  <FactoryButton />
                </div>
              </td>
              <td>
                <div>Дата</div>
                <br />
                <div>
                  <RangePicker />
                </div>
              </td>
              <td>
                <div>Время</div>
                <br />
                <div>
                  <TimePicker.RangePicker format="HH:mm" />
                </div>
              </td>
            </tr>
          </table>
          <div className="ml-4">
            <Button>Создать отчёт</Button>
          </div>
        </div>
        <br />
        <div>
          <HistoryTable />
        </div>
      </div>
    </div>
  );
};

export default History;
