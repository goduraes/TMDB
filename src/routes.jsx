import React, { useContext } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from 'react-router-dom';
import Loading from './components/Loading';

import Navbar from './components/Navbar';
import Footer from './components/Footer';

import Home from './pages/Home';
import Login from './pages/Login';
import Search from './pages/Search';
import ListMoviesAndTv from './pages/ListMoviesAndTv';

import { AuthProvider, AuthContext } from './contexts/auth';

const Private = ({ children }) => {
  const { authenticated, loading } = useContext(AuthContext);
  if (loading) {
    return <Loading />;
  }
  if (!authenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
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
          <Route
            exact
            path="/search"
            element={
              <Private>
                <Search />
              </Private>
            }
          />
          <Route
            exact
            path="/movies"
            element={
              <Private>
                <ListMoviesAndTv type="movie" />
              </Private>
            }
          />
          <Route
            exact
            path="/tv"
            element={
              <Private>
                <ListMoviesAndTv type="tv" />
              </Private>
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default AppRoutes;
