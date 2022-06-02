import React from 'react';
import PropTypes, { string } from 'prop-types';
import styled from 'styled-components';

import './index.css';

const Ratio = styled.div`
  --ratio: ${props => props.percentage ?  props.percentage :  0};
`;

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

  const percentageRatio =
    vote_average !== 10
      ? `.${vote_average.toFixed(1).replace('.', '')}`
      : vote_average;

  return (
    <div key={id} id="cardItem" className="relative rounded-lg z-10">
      <div className="img-item relative">
        <img className="rounded-lg md:h-auto" src={urlImg} alt="" />
        <div className="voteAverage font-bold text-white">
          <span className="absolute z-10 text-sm">{vote_average}</span>
          <Ratio className="ratio" percentage={percentageRatio} />
        </div>
      </div>
      <div className="flex flex-col justify-between max-w-full">
        <span className="font-bold text-gray-900 text-center mt-4 px-2">
          {titleItem}
        </span>
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
    vote_average: PropTypes.number,
  }).isRequired,
};

export default CardItem;
