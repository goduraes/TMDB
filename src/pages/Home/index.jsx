import React, { useState, useEffect } from 'react';
import API from '../../service/api';
import CardItem from '../../components/CardItem';
import Loading from '../../components/Loading';

import './index.css';

import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const Home = () => {
  const [trendingList, setTrendingList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    API.get(`/trending/all/day?api_key=${process.env.REACT_APP_API_KEY}`)
      .then((resp) => {
        setTrendingList(resp.data.results);
      })
      .catch(() => {
        setError(true);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <>
      <Navbar />
      <div className="main-content container max-w-7xl mx-auto px-4 sm:px-6">
        <h1 className="text-3xl font-bold text-gray-800 py-4 text-center">
          Daily Trends
        </h1>
        {loading && <Loading opacity={0.7} />}

        {!loading && !error && (
          <div className="content-home flex justify-center gap-7 flex-wrap mb-10">
            {trendingList.map((item) => (
              <CardItem
                key={item.id}
                item={item}
                className="relative border rounded"
              />
            ))}
          </div>
        )}

        {!loading && error &&(
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-10"
            role="alert"
          >
            <strong className="font-bold">Ops! </strong>
            <span className="block sm:inline">
              Something went wrong while trying to fetch the data!
            </span>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default Home;
