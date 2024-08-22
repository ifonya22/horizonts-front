import React, { useState, useEffect } from 'react';
import { Layout, ConfigProvider } from "antd";
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from "./components/Header";
import Statistic from "./pages/Statistic";
import History from "./pages/History";
import Settings from "./pages/Settings";
import Login from './pages/Login';
const { Content } = Layout;

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('isAuthenticated') === 'true';
  });

  useEffect(() => {
    localStorage.setItem('isAuthenticated', isAuthenticated);
  }, [isAuthenticated]);

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#f57838",
        },
      }}
    >
      <Router>
        <Layout>
          <Header setIsAuthenticated={setIsAuthenticated} />
          <Content style={{ padding: "20px" }}>
            <Routes>
              {isAuthenticated ? (
                <>
                  <Route path="/statistic" element={<Statistic />} />
                  <Route path="/history" element={<History />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="*" element={<Navigate to="/statistic" />} />
                </>
              ) : (
                <>
                  <Route path="/" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
                  <Route path="*" element={<Navigate to="/" />} />
                </>
              )}
            </Routes>
          </Content>
        </Layout>
      </Router>
    </ConfigProvider>
  );
};

export default App;
