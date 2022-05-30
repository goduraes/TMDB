import React, { useContext } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from 'react-router-dom';

import Home from './pages/Home';
import Login from './pages/Login';

import { AuthProvider, AuthContext } from './contexts/auth';

const loadingItem = (
  <div className="loader-wrapper">
    <span className="loader">
      <span className="loader-inner" />
    </span>
  </div>
);

const Private = ({ children }) => {
  const { authenticated, loading } = useContext(AuthContext);
  if (loading) {
    return loadingItem;
  }

  if (!authenticated) {
    return <Navigate to="/login" />;
  }
  return children;
};

const AppRoutes = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route exact path="/login" element={<Login />} />
          <Route
            exact
            path="/"
            element={
              <Private>
                <Home />
              </Private>
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default AppRoutes;
