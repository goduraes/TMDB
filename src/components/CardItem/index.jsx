import React from 'react';
import PropTypes from 'prop-types';

const CardItem = ({ item }) => {
  const { id, media_type, profile_path, poster_path, title, name } = item;
  const titleItem = media_type === 'movie' ? title : name;

  let urlImg = media_type === 'person' ? profile_path : poster_path;
  urlImg = urlImg
    ? `https://image.tmdb.org/t/p/w200/${urlImg}`
    : '/200x300.png';

  return (
    <div
      key={id}
      className="relative border rounded z-10"
      style={{ width: '200px' }}
    >
      <img className="rounded md:h-auto" src={urlImg} alt="" />
      <div className="flex flex-col justify-between max-w-full">
        <span className="font-bold text-gray-900 text-center">{titleItem}</span>
      </div>
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
  }).isRequired,
};

export default CardItem;
