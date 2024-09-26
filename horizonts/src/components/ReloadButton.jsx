import { Button } from "antd";

const ReloadButton = () => {
    const handleReload = () => {
        window.location.reload();
    };

    return (
        <Button 
            onClick={handleReload} 
            style={{ backgroundColor: 'red', color: 'white' }} 
            danger
        >
            Получить значения
        </Button>

    );
};

export default ReloadButton;
