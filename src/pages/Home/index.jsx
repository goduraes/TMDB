import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Scrollbar } from 'swiper';
import API from '../../service/api';
import CardItem from '../../components/CardItem';
import Loading from '../../components/Loading';

import 'swiper/css';
import 'swiper/css/scrollbar';
import './index.css';

const Home = () => {
  const [trendingList, setTrendingList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const numberSlidesPerView = () => {
    const { innerWidth: width } = window;
    if (width <= 640) {
      return 2;
    }
    if (width > 640 && width <= 1024) {
      return 4;
    }
    if (width > 1024 && width <= 1280) {
      return 6;
    }
    return 7;
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
      <h1 className="text-2xl font-bold text-gray-800 py-4">
        Daily Trends {numberSlidesPerView()}
      </h1>
      {loading && <Loading opacity={0.7} />}

      {!loading && !error && (
        <div>
          <Swiper
            spaceBetween={30}
            slidesPerView={numberSlidesPerView()}
            scrollbar={{ draggable: true }}
            modules={[Scrollbar]}
          >
            {trendingList.map((item) => (
              <SwiperSlide key={item.id} className="mb-5">
                <CardItem item={item} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}

      {!loading && error && (
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
  );
};

export default Home;
