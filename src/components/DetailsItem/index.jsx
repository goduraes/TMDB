/* This example requires Tailwind CSS v2.0+ */
import React, { Fragment, useEffect, useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { Dialog, Transition, Menu } from '@headlessui/react';
import { XIcon } from '@heroicons/react/outline';
import {
  HeartIcon,
  BookmarkIcon,
  StarIcon,
  CheckIcon,
} from '@heroicons/react/solid';
import styled from 'styled-components';
import ReactTooltip from 'react-tooltip';
import Loading from '../Loading';
import { API } from '../../service/api';

import { AuthContext } from '../../contexts/auth';

import './index.css';

const TypeItem = styled.div`
  top: 5px;
  left: 5px;
  background: ${(props) => (props.type === 'tv' ? '#01b4e4' : '#0d253f')};
  text-transform: uppercase;
`;

const Ratio = styled.div`
  --ratio: ${(props) => (props.percentage ? props.percentage : 0)};
`;

const Status = styled.div`
  text-transform: uppercase;
  top: 5px;
  right: 5px;
`;

const timeConvert = (n) => {
  const num = n;
  const hours = num / 60;
  const rhours = Math.floor(hours);
  const minutes = (hours - rhours) * 60;
  const rminutes = Math.round(minutes);
  return `${rhours}h${rminutes}m`;
};

const DetailsItem = ({ open, onClose, item }) => {
  const [itemDetails, setItemDetails] = useState({});
  const [tooltip, showTooltip] = useState({});
  const [error, setError] = useState(false);
  const [loadingItem, setLoadingItem] = useState(true);
  const [percentageRatio, setPercentageRatio] = useState(0);
  const [favorite, setFavorite] = useState(false);
  const [watchlist, setWatchlist] = useState(false);
  const [openRate, setOpenRate] = useState(false);
  const [rate, setRate] = useState(5);
  const [rateOk, setRateOk] = useState(false);
  const { user } = useContext(AuthContext);

  const Favorite = () => {
    API.post(
      `/account/${user.id}/favorite?api_key=${process.env.REACT_APP_API_KEY}&session_id=${user.session_id}`,
      {
        media_type: item.media_type,
        media_id: item.id,
        favorite: true,
      },
    )
      .then(() => {
        setFavorite(true);
      })
      .finally(() => {
        setTimeout(() => {
          setFavorite(false);
        }, 2000);
      });
  };

  const Watchlist = () => {
    API.post(
      `/account/${user.id}/watchlist?api_key=${process.env.REACT_APP_API_KEY}&session_id=${user.session_id}`,
      {
        media_type: item.media_type,
        media_id: item.id,
        watchlist: true,
      },
    )
      .then(() => {
        setWatchlist(true);
      })
      .finally(() => {
        setTimeout(() => {
          setWatchlist(false);
        }, 2000);
      });
  };

  const Rate = () => {
    API.post(
      `/${item.media_type}/${item.id}/rating?api_key=${process.env.REACT_APP_API_KEY}&session_id=${user.session_id}`,
      {
        value: rate,
      },
    )
      .then(() => {
        setRateOk(true);
      })
      .finally(() => {
        setOpenRate(false);
        setTimeout(() => {
          setRateOk(false);
        }, 2000);
      });
  };

  useEffect(() => {
    if (open) {
      setPercentageRatio(0);
      if (item.vote_average) {
        const value =
          item.vote_average !== 10
            ? `.${item.vote_average.toFixed(1).replace('.', '')}`
            : item.vote_average;
        setPercentageRatio(value);
      }

      API.get(
        `/${item.media_type}/${item.id}?api_key=${process.env.REACT_APP_API_KEY}`,
      )
        .then((resp) => {
          setItemDetails(resp.data);
        })
        .catch(() => {
          setError(true);
        })
        .finally(() => {
          setLoadingItem(false);
        });
    }
  }, [open]);

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto relative w-screen max-w-md">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-in-out duration-500"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-500"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <div className="absolute top-0 left-0 -ml-8 flex pt-4 pr-2 sm:-ml-10 sm:pr-4">
                      <button
                        type="button"
                        className="rounded-md text-gray-300 hover:text-white outline-none"
                        onClick={() => onClose(false)}
                      >
                        <span className="sr-only">Close panel</span>
                        <XIcon className="h-6 w-6" aria-hidden="true" />
                      </button>
                    </div>
                  </Transition.Child>
                  <div
                    id="detailsItem"
                    className="flex h-full flex-col overflow-y-scroll bg-tmdb-dark-blue shadow-xl"
                  >
                    {!loadingItem && !error && (
                      <div>
                        {item.media_type === 'movie' ||
                        item.media_type === 'tv' ? (
                          <>
                            {tooltip && (
                              <ReactTooltip
                                place="top"
                                type="dark"
                                effect="solid"
                              />
                            )}

                            <div className="relative mb-7">
                              <Dialog.Title
                                className="absolute z-10 py-4 w-full h-full text-center flex flex-col
                                items-center justify-center text-lg text-white font-medium "
                              >
                                <span className="text-2xl md:text-4xl px-2 font-bold shadowTX">
                                  {item.media_type === 'movie'
                                    ? item.title
                                    : item.name}
                                </span>
                                <span className="text-sm md:text-1xl px-2 italic mt-2 shadowTX">
                                  {itemDetails.tagline}
                                </span>
                              </Dialog.Title>
                              <TypeItem
                                className="absolute z-10 text-white text-xs	md:text-sm p-1 rounded-lg px-3"
                                type={item.media_type}
                              >
                                {item.media_type}
                              </TypeItem>
                              <Status className="absolute bg-black z-10 text-white text-xs md:text-sm p-1 rounded-lg px-3">
                                {itemDetails.status}
                              </Status>
                              <div className="voteAverage font-bold text-gray-900 z-10">
                                <span className="absolute z-20">
                                  {item.vote_average}
                                </span>
                                <Ratio
                                  className="ratio z-10"
                                  percentage={percentageRatio}
                                />
                              </div>
                              <div className="backdropPath">
                                {item.backdrop_path && (
                                  <img
                                    className="w-full opacity-60"
                                    src={`https://image.tmdb.org/t/p/w500/${item.backdrop_path}`}
                                    alt="Backdrop"
                                  />
                                )}
                              </div>
                            </div>

                            <div className="flex w-full items-center justify-between mt-2 mb-4 px-4 sm:px-6">
                              <img
                                width={150}
                                className="rounded-lg hidden md:block"
                                src={
                                  item.poster_path
                                    ? `https://image.tmdb.org/t/p/w200/${item.poster_path}`
                                    : '200x300.png'
                                }
                                alt="Backdrop"
                              />
                              <div className="w-full px-4 sm:px-6">
                                <div className="w-full mt-2 text-sm text-white">
                                  {(itemDetails.runtime ||
                                    itemDetails.episode_run_time) && (
                                    <div>
                                      <span className="font-bold">Time: </span>
                                      {itemDetails.runtime && (
                                        <span>
                                          {timeConvert(itemDetails.runtime)}{' '}
                                        </span>
                                      )}
                                      {itemDetails.episode_run_time &&
                                        itemDetails.episode_run_time[0] && (
                                          <span>
                                            {timeConvert(
                                              itemDetails.episode_run_time[0],
                                            )}
                                          </span>
                                        )}
                                    </div>
                                  )}
                                  {(itemDetails.release_date ||
                                    itemDetails.first_air_date) && (
                                    <div>
                                      <span className="font-bold">
                                        Release Date:{' '}
                                      </span>
                                      {itemDetails.release_date && (
                                        <span>{itemDetails.release_date} </span>
                                      )}
                                      {itemDetails.first_air_date && (
                                        <span>
                                          {itemDetails.first_air_date}{' '}
                                        </span>
                                      )}
                                    </div>
                                  )}
                                  {itemDetails.number_of_seasons && (
                                    <div>
                                      <span className="font-bold">
                                        Seasons:{' '}
                                      </span>
                                      <span>
                                        {itemDetails.number_of_seasons}{' '}
                                      </span>
                                    </div>
                                  )}
                                  {itemDetails.number_of_episodes && (
                                    <div>
                                      <span className="font-bold">
                                        Episodes:{' '}
                                      </span>
                                      <span>
                                        {itemDetails.number_of_episodes}{' '}
                                      </span>
                                    </div>
                                  )}
                                </div>

                                {itemDetails.genres && (
                                  <div className="mt-2">
                                    {itemDetails.genres.map((genre, i) => (
                                      <span
                                        key={genre.id}
                                        className="green-tmdb-text text-sm"
                                      >
                                        {genre.name}
                                        {i + 1 !== itemDetails.genres.length &&
                                          ', '}
                                      </span>
                                    ))}
                                  </div>
                                )}

                                <div className="flex mt-4 items-center justify-between w-full">
                                  <button
                                    type="button"
                                    data-tip="Mark as favorite"
                                    onClick={Favorite}
                                    onMouseEnter={() => showTooltip(true)}
                                    onMouseLeave={() => {
                                      showTooltip(false);
                                      setTimeout(() => showTooltip(true), 1);
                                    }}
                                    className={`bg-slate-900 hover:opacity-80 ${
                                      favorite ? 'text-red-600' : 'text-white'
                                    } font-bold mx-2 py-2 px-4 rounded-lg`}
                                  >
                                    <HeartIcon
                                      className="h-4 w-4"
                                      aria-hidden="true"
                                    />
                                  </button>

                                  <Menu
                                    as="div"
                                    className="relative inline-block text-left"
                                  >
                                    <Menu.Button
                                      onClick={() => setOpenRate(!openRate)}
                                      data-tip="Rate It!"
                                      onMouseEnter={() => showTooltip(true)}
                                      onMouseLeave={() => {
                                        showTooltip(false);
                                        setTimeout(() => showTooltip(true), 1);
                                      }}
                                      className={`bg-slate-900 hover:opacity-80 ${
                                        rateOk
                                          ? 'text-yellow-600'
                                          : 'text-white'
                                      } font-bold mx-2 py-2 px-4 rounded-lg`}
                                    >
                                      <StarIcon
                                        className="h-4 w-4"
                                        aria-hidden="true"
                                      />
                                    </Menu.Button>

                                    <Transition
                                      as={Fragment}
                                      show={openRate}
                                      enter="transition ease-out duration-100"
                                      enterFrom="transform opacity-0 scale-95"
                                      enterTo="transform opacity-100 scale-100"
                                      leave="transition ease-in duration-75"
                                      leaveFrom="transform opacity-100 scale-100"
                                      leaveTo="transform opacity-0 scale-95"
                                    >
                                      <Menu.Items
                                        className="right-0 origin-top-left mt-1 absolute bg-gray-900
                                      w-48 rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                                      >
                                        <Menu.Item>
                                          <div className="rounded-lg flex flex-col bg-gray-900 items-center p-3 w-full">
                                            <div className="text-white  mb-2">
                                              Rate! {rate}
                                            </div>
                                            <input
                                              className="w-full"
                                              type="range"
                                              step="0.10"
                                              onChange={(e) =>
                                                setRate(e.target.value)
                                              }
                                              value={rate}
                                              min="0"
                                              max="10"
                                            />
                                            <button
                                              type="button"
                                              onClick={Rate}
                                              className="mt-3 w-12 bg-green-600 hover:opacity-80 text-white font-boldmx-2 py-2 px-4 rounded-lg"
                                            >
                                              <CheckIcon
                                                className="h-5 w-5"
                                                aria-hidden="true"
                                              />
                                            </button>
                                          </div>
                                        </Menu.Item>
                                      </Menu.Items>
                                    </Transition>
                                  </Menu>
                                  <button
                                    type="button"
                                    data-tip="Add to your watchlist"
                                    onClick={Watchlist}
                                    onMouseEnter={() => showTooltip(true)}
                                    onMouseLeave={() => {
                                      showTooltip(false);
                                      setTimeout(() => showTooltip(true), 1);
                                    }}
                                    className={`bg-slate-900 hover:opacity-80 ${
                                      watchlist
                                        ? 'text-amber-500'
                                        : 'text-white'
                                    } font-bold mx-2 py-2 px-4 rounded-lg`}
                                  >
                                    <BookmarkIcon
                                      className="h-4 w-4"
                                      aria-hidden="true"
                                    />
                                  </button>
                                </div>
                              </div>
                            </div>

                            {itemDetails.overview && (
                              <div className="mt-2 px-4 sm:px-6">
                                <span className="text-2xl text-white font-bold w-full">
                                  Overview
                                </span>
                                <div className="text-white mt-2">
                                  {itemDetails.overview}
                                </div>
                              </div>
                            )}
                          </>
                        ) : (
                          <div>
                            <div className="relative flex flex-col items-center">
                              <div className="mt-6 flex-1 px-4 sm:px-6">
                                <img
                                  className="z-0 rounded-lg"
                                  src={
                                    itemDetails.profile_path
                                      ? `https://image.tmdb.org/t/p/w200${itemDetails.profile_path}`
                                      : '/200x300.png'
                                  }
                                  alt="Profile"
                                />
                              </div>
                              <Dialog.Title className="z-10 p-4 sm:p-6 w-full h-full text-center flex items-center justify-center text-lg text-white font-medium">
                                <span className="text-4xl font-bold">
                                  {itemDetails.name}
                                </span>
                              </Dialog.Title>
                            </div>
                            {itemDetails.birthday &&
                              itemDetails.place_of_birth && (
                                <div className=" flex-1 px-4 sm:px-6">
                                  <div className="text-white mt-2">
                                    <span className="text-white font-bold w-full">
                                      Birth:
                                    </span>
                                    <span> {itemDetails.birthday}, </span>
                                    <span> {itemDetails.place_of_birth}</span>
                                  </div>
                                </div>
                              )}
                            {itemDetails.biography && (
                              <div className="mt-6 flex-1 px-4 sm:px-6">
                                <span className="text-2xl text-white font-bold w-full">
                                  Overview
                                </span>
                                <div className="text-white mt-2">
                                  {itemDetails.biography}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                    {loadingItem && !error && <Loading opacity={0} />}
                    {!loadingItem && error && (
                      <div className="mt-2 px-4 sm:px-6">
                        <div
                          className="mt-2 px-4 sm:px-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-5 mb-10"
                          role="alert"
                        >
                          <strong className="font-bold">Ops! </strong>
                          <span className="block sm:inline">
                            Something went wrong while trying to fetch the data!
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

DetailsItem.defaultProps = {
  item: {},
};

DetailsItem.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  item: PropTypes.shape({
    id: PropTypes.number,
    vote_average: PropTypes.number,
    media_type: PropTypes.string,
    backdrop_path: PropTypes.string,
    poster_path: PropTypes.string,
    title: PropTypes.string,
    name: PropTypes.string,
  }),
};

export default DetailsItem;
