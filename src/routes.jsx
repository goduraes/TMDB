import React, { useContext } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from 'react-router-dom';
import Loading from './components/Loading';

import Home from './pages/Home';
import Login from './pages/Login';

import { AuthProvider, AuthContext } from './contexts/auth';

const Private = ({ children }) => {
  const { authenticated, loading } = useContext(AuthContext);
  if (loading) {
    return <Loading />;
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
