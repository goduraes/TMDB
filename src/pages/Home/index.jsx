import React, { useState, useEffect } from 'react';
import API from '../../service/api';

import './index.css';

import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const Home = () => {
  const [trendingList, setTrendingList] = useState([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    API.get(`/trending/all/day?api_key=${process.env.REACT_APP_API_KEY}`)
      .then((resp) => {
        setTrendingList(resp.data.results);
      })
      .catch(() => {
        setError(true);
      });
  }, []);

  return (
    <div>
      <Navbar />
      <div className="main-content container max-w-7xl mx-auto px-4 sm:px-6">
        <h1 className="text-3xl font-bold text-gray-800 py-4 text-center">
          Daily Trends
        </h1>
        {!error ? (
          <div className="content-home flex justify-center gap-7 flex-wrap">
            {trendingList.map((item) => (
              <div className="relative border rounded">
                <img
                  className="w-full rounded h-96 md:h-auto md:w-48"
                  src={`https://image.tmdb.org/t/p/w300/${
                    item.media_type === 'person'
                      ? item.profile_path
                      : item.poster_path
                  }`}
                  alt=""
                />
                <div className="flex flex-col justify-between leading-normal h-96 md:h-auto md:w-48">
                  <span className="text-2xl font-bold tracking-tight text-gray-900 text-center">
                    {item.media_type === 'movie' ? item.title : item.name}
                  </span>
                </div>
              </div>
            ))}


          </div>
        ) : (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
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
    </div>
  );
};

export default Home;
