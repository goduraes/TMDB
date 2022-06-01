import React from 'react';
import PropTypes from 'prop-types';
import './index.css';

const Loading = ({ opacity }) => {
  return (
    <div
      className="loader-wrapper z-50"
      style={{
        background: `linear-gradient(90deg, rgba(13, 37, 63, ${opacity}), rgba(1, 180, 228, ${opacity}), rgba(144, 206, 161, ${opacity}))`,
      }}
    >
      <span className="loader">
        <span className="loader-inner" />
      </span>
    </div>
  );
};

Loading.defaultProps = {
  opacity: 1,
};

Loading.propTypes = {
  opacity: PropTypes.number,
};

export default Loading;
