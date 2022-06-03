import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SearchIcon } from '@heroicons/react/solid';
import API from '../../service/api';
import Loading from '../../components/Loading';
import SwiperItens from '../../components/SwiperItens';

import 'swiper/css';
import 'swiper/css/scrollbar';
import './index.css';

const Home = () => {
  const navigate = useNavigate();
  const [trendingList, setTrendingList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [textSearch, setTextSearch] = useState('');

  const search = () => {
    navigate(`/search?q=${textSearch}`);
  };

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
    <div className="main-content container max-w-7xl mx-auto px-4 sm:px-6">
      {loading && <Loading opacity={0.3} />}

      <div className="bg-search">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            <span className="block">Welcome.</span>
            <span className="block blue-tmdb-text mt-2">
              Millions of movies, TV shows and people to discover. Explore now.
            </span>
          </h2>

          <form className="mt-5">
            <label
              htmlFor="default-search"
              className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-gray-300"
            >
              Search
            </label>
            <div className="relative">
              <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none green-tmdb-text">
                <SearchIcon className="h-4 w-4" aria-hidden="true" />
              </div>
              <input
                type="text"
                id="default-search"
                autoComplete="off"
                value={textSearch}
                onChange={(e) => setTextSearch(e.target.value)}
                onKeyPress={(e) => e.charCode === 13 && search()}
                className="block p-4 pl-10 pr-20 w-full text-gray-900 bg-gray-50 rounded-lg outline-none"
                placeholder="Search for a movie, tv show, person......"
              />
              <button
                onClick={search}
                type="submit"
                className="bg-tmdb-gren text-white absolute right-2.5 bottom-2.5 hover:opacity-80 font-medium rounded-lg text-sm px-3 py-2"
              >
                Search
              </button>
            </div>
          </form>
        </div>
      </div>

      {!loading && !error && (
        <SwiperItens list={trendingList} title="Daily Trends" />
      )}

      {!loading && error && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-5 mb-10"
          role="alert"
        >
          <strong className="font-bold">Ops! </strong>
          <span className="block sm:inline">
            Something went wrong while trying to fetch the data!
          </span>
        </div>
      )}
    </div>
  );
};

export default Home;
