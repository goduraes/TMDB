import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import API from '../../service/api';
import Loading from '../../components/Loading';
import SwiperItens from '../../components/SwiperItens';

import 'swiper/css';
import 'swiper/css/scrollbar';

const ListMoviesAndTv = ({ type }) => {
  const [trendingList, setTrendingList] = useState([]);
  const [popularList, setPopularList] = useState([]);
  const [topRatedList, setTopRatedList] = useState([]);
  const [upcomingList, setUpcomingList] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const getTrending = () => {
    API.get(`/trending/${type}/day?api_key=${process.env.REACT_APP_API_KEY}`)
      .then((resp) => {
        setTrendingList(resp.data.results);
      })
      .catch(() => {
        setError(true);
      });
  };
  const gePopular = () => {
    API.get(`/${type}/popular?api_key=${process.env.REACT_APP_API_KEY}`)
      .then((resp) => {
        setPopularList(resp.data.results);
      })
      .catch(() => {
        setError(true);
      });
  };
  const getTopRated = () => {
    API.get(`/${type}/top_rated?api_key=${process.env.REACT_APP_API_KEY}`)
      .then((resp) => {
        setTopRatedList(resp.data.results);
      })
      .catch(() => {
        setError(true);
      });
  };
  const getUpcoming = () => {
    API.get(`/${type}/upcoming?api_key=${process.env.REACT_APP_API_KEY}`)
      .then((resp) => {
        setUpcomingList(resp.data.results);
      })
      .catch(() => {
        setError(true);
      });
  };

  useEffect(() => {
    setLoading(true);
    try {
      getTrending();
      gePopular();
      getTopRated();
      if (type !== 'tv') {
        getUpcoming();
      }
    } finally {
      setLoading(false);
    }
  }, [type]);

  return (
    <div className="main-content container max-w-7xl mx-auto px-4 sm:px-6">
      {loading && <Loading opacity={0.3} />}

      {!loading && !error && (
        <>
          <SwiperItens
            list={trendingList}
            title="Daily Trends"
            mediaType={type}
          />
          <SwiperItens list={popularList} title="Popular" mediaType={type} />
          <SwiperItens list={topRatedList} title="Top Rated" mediaType={type} />
          <SwiperItens list={upcomingList} title="Upcoming" mediaType={type} />
        </>
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

ListMoviesAndTv.propTypes = {
  type: PropTypes.string.isRequired,
};

export default ListMoviesAndTv;
