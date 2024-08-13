import React from 'react';
import { Layout } from 'antd';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header'; // Импортируем наш Header
import Statistic from './pages/Statistic';
import History from './pages/History';
import Settings from './pages/Settings';

const { Content } = Layout;

const App = () => {
  return (
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
  );
};

export default App;
