import React from 'react';
import PropTypes from 'prop-types';

import './index.css';

const CardItem = ({ item }) => {
  const {
    id,
    media_type,
    profile_path,
    poster_path,
    title,
    name,
    vote_average,
  } = item;
  const titleItem = media_type === 'movie' ? title : name;

  let urlImg = media_type === 'person' ? profile_path : poster_path;
  urlImg = urlImg
    ? `https://image.tmdb.org/t/p/w200/${urlImg}`
    : '/200x300.png';

  return (
    <div key={id} id="cardItem" className="relative rounded z-10">
      <img className="rounded md:h-auto" src={urlImg} alt="" />
      <div className="flex flex-col justify-between max-w-full">
        <span className="font-bold text-gray-900 text-center mt-3 px-2">
          {titleItem}
        </span>
      </div>
      <div className="voteAverage font-bold text-white">{vote_average}</div>
    </div>
  );
};

CardItem.propTypes = {
  item: PropTypes.shape({
    backdrop_path: PropTypes.string,
    profile_path: PropTypes.string,
    name: PropTypes.string,
    id: PropTypes.number,
    media_type: PropTypes.string,
    poster_path: PropTypes.string,
    title: PropTypes.string,
    vote_average: PropTypes.number,
  }).isRequired,
};

export default CardItem;
