import React from 'react';
import './index.css';

import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const Home = () => {
  return (
    <div>
      <Navbar />
      <h1 className="text-3xl font-bold">Home</h1>
      <Footer />
    </div>
  );
};

export default Home;
