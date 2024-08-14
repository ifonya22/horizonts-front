import React from 'react';
import { Layout, ConfigProvider } from 'antd';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header'; // Импортируем наш Header
import Statistic from './pages/Statistic';
import History from './pages/History';
import Settings from './pages/Settings';

const { Content } = Layout;

const App = () => {
  return (
    <ConfigProvider
    theme={{
      token: {
        colorPrimary: '#f57838',
      }
    }}
  >
    <Router>
      <Layout>
        <Header /> 
        <Content style={{ padding: '20px' }}>
          <Routes>
            <Route path='/statistic' element={<Statistic />} />
            <Route path='/history' element={<History />} />
            <Route path='/settings' element={<Settings />} />
          </Routes>
        </Content>
      </Layout>
    </Router>
    </ConfigProvider>
  );
};

export default App;
