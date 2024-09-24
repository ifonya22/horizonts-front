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
    return !!localStorage.getItem('access_token');
  });

  const [userFullName, setUserFullName] = useState(() => {
    return localStorage.getItem('userFullName') || '';
  });

  const [username, setUsername] = useState(() => {
    return localStorage.getItem('username') || '';
  });

  useEffect(() => {
    localStorage.setItem('isAuthenticated', isAuthenticated);
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      const fetchUserData = async () => {
        try {
          const response = await fetch('http://localhost:8000/api/v1/auth/users/me', {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
            },
          });
          if (response.ok) {
            const userData = await response.json();
            setUserFullName(userData.full_name);
            localStorage.setItem('userFullName', userData.full_name);
            setUsername(userData.username); // сохраняем username
            localStorage.setItem('username', userData.username); // сохраняем в localStorage
          } else {
            setIsAuthenticated(false);
            localStorage.removeItem('access_token');
            localStorage.removeItem('userFullName');
            localStorage.removeItem('username'); // удаляем username
          }
        } catch (error) {
          console.error('Ошибка загрузки данных пользователя:', error);
          setIsAuthenticated(false);
          localStorage.removeItem('access_token');
          localStorage.removeItem('userFullName');
          localStorage.removeItem('username'); // удаляем username
        }
      };

      fetchUserData();
    } else {
      setUserFullName('');
      setUsername(''); // сбрасываем username
      localStorage.removeItem('userFullName');
      localStorage.removeItem('username'); // удаляем username
    }
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
          <Header setIsAuthenticated={setIsAuthenticated} userFullName={userFullName} username={username} />
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
                  <Route path="/" element={<Login setIsAuthenticated={setIsAuthenticated} setUserFullName={setUserFullName} />} />
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
