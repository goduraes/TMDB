import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import PropTypes from 'prop-types';
import { Scrollbar } from 'swiper';
import CardItem from '../CardItem';
import DetailsItem from '../DetailsItem';

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

const SwiperItens = ({ list, title, mediaType }) => {
  const [openDetails, setOpenDetails] = useState(false);
  const [itemDetails, setItemDetails] = useState(null);
  return (
    <>
      <h1 className="text-2xl font-bold text-gray-800 py-4">{title}</h1>
      <div className="mb-3">
        <Swiper
          spaceBetween={30}
          slidesPerView={numberSlidesPerView()}
          scrollbar={{ draggable: true }}
          modules={[Scrollbar]}
        >
          {list &&
            list.length > 0 &&
            list.map((item) => (
              <SwiperSlide
                key={item.id}
                className="mb-5"
                onClick={() => {
                  setItemDetails(
                    mediaType ? { ...item, media_type: mediaType } : item,
                  );
                  setOpenDetails(true);
                }}
              >
                <CardItem
                  item={mediaType ? { ...item, media_type: mediaType } : item}
                />
              </SwiperSlide>
            ))}
        </Swiper>

        <DetailsItem
          open={openDetails}
          onClose={setOpenDetails}
          item={itemDetails}
        />
      </div>
    </>
  );
};

SwiperItens.defaultProps = {
  mediaType: null,
};

SwiperItens.propTypes = {
  title: PropTypes.string.isRequired,
  mediaType: PropTypes.string,
  list: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
    }),
  ).isRequired,
};

export default SwiperItens;
