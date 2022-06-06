import React, { useState, useEffect, useContext, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Dialog, Transition } from '@headlessui/react';
import { XIcon, PlusIcon } from '@heroicons/react/outline';
import { FilterIcon } from '@heroicons/react/solid';
import ReactTooltip from 'react-tooltip';
import CardItem from '../../components/CardItem';
import DetailsItem from '../../components/DetailsItem';
import API from '../../service/api';
import Loading from '../../components/Loading';

import { AuthContext } from '../../contexts/auth';

import 'swiper/css';
import 'swiper/css/scrollbar';

const categories = [
  { name: 'Movies', id: 'movies', mediaType: 'movie' },
  { name: 'TV Shows', id: 'tv', mediaType: 'tv' },
];

const MyLists = ({ type }) => {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [title, setTitle] = useState('Favorites');
  const [category, setCategoriy] = useState(categories[0]);
  const [openDetails, setOpenDetails] = useState(false);
  const [tooltip, showTooltip] = useState({});
  const [itemDetails, setItemDetails] = useState(null);
  const { user } = useContext(AuthContext);
  const [list, setList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const [depChanges, setDepChanges] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const getLists = () => {
    API.get(
      `/account/${user.id}/${type}/${category.id}?api_key=${process.env.REACT_APP_API_KEY}&session_id=${user.session_id}&page=${currentPage}`,
    )
      .then((resp) => {
        const arrayConcat = list.concat(resp.data.results);
        setList(resp.data.page === 1 ? resp.data.results : arrayConcat);
        setTotalPage(resp.data.total_pages);
      })
      .catch(() => {
        setError(true);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const Favorite = (itemAction) => {
    API.post(
      `/account/${user.id}/favorite?api_key=${process.env.REACT_APP_API_KEY}&session_id=${user.session_id}`,
      {
        media_type: itemAction.media_type,
        media_id: itemAction.id,
        favorite: false,
      },
    ).finally(() => {
      getLists();
    });
  };

  const Rate = (itemAction) => {
    API.delete(
      `/${itemAction.media_type}/${itemAction.id}/rating?api_key=${process.env.REACT_APP_API_KEY}&session_id=${user.session_id}`,
    ).finally(() => {
      getLists();
    });
  };

  const Watchlist = (itemAction) => {
    API.post(
      `/account/${user.id}/watchlist?api_key=${process.env.REACT_APP_API_KEY}&session_id=${user.session_id}`,
      {
        media_type: itemAction.media_type,
        media_id: itemAction.id,
        watchlist: false,
      },
    ).finally(() => {
      getLists();
    });
  };

  useEffect(() => {
    setLoading(true);
    if (depChanges) {
      if (depChanges.type !== type || depChanges.category !== category) {
        setCurrentPage(1);
      }
    }
    setDepChanges({
      type,
      category,
      currentPage,
    });
    switch (type) {
      case 'favorite':
        setTitle('Favorites');
        break;
      case 'rated':
        setTitle('Rated');
        break;
      case 'watchlist':
        setTitle('Watchlist');
        break;
      default:
        setTitle('');
        break;
    }
    getLists();
  }, [type, category, currentPage]);

  return (
    <div className="main-content">
      <div>
        <Transition.Root show={mobileFiltersOpen} as={Fragment}>
          <Dialog
            as="div"
            className="relative z-40 lg:hidden"
            onClose={setMobileFiltersOpen}
          >
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black bg-opacity-25" />
            </Transition.Child>

            <div className="fixed inset-0 flex z-40">
              <Transition.Child
                as={Fragment}
                enter="transition ease-in-out duration-300 transform"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="ml-auto relative max-w-xs w-full h-full bg-white shadow-xl py-4 pb-12 flex flex-col overflow-y-auto">
                  <div className="px-4 flex items-center justify-between">
                    <h2 className="text-lg font-medium text-gray-900">
                      Categories
                    </h2>
                    <button
                      type="button"
                      className="-mr-2 w-10 h-10 bg-white p-2 rounded-md flex items-center justify-center text-gray-400"
                      onClick={() => setMobileFiltersOpen(false)}
                    >
                      <span className="sr-only">Close menu</span>
                      <XIcon className="h-6 w-6" aria-hidden="true" />
                    </button>
                  </div>

                  <form className="mt-4 border-t border-gray-200">
                    <h3 className="sr-only">Categories</h3>
                    <ul className="font-medium text-gray-900 px-2 py-3">
                      {categories.map((categoryItem) => (
                        <li
                          key={categoryItem.id}
                          className={`${
                            category.id === categoryItem.id && 'bg-tmdb-blue'
                          } rounded hover:opacity-80`}
                        >
                          <button
                            type="button"
                            onClick={() => {
                              setCategoriy(categoryItem);
                              setCurrentPage(1);
                            }}
                            className="block text-left px-2 py-3 w-full"
                          >
                            {categoryItem.name}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition.Root>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative z-10 flex items-baseline justify-between border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-800 py-4">{title}</h1>

            <div className="flex items-center">
              <button
                type="button"
                className="p-2 -m-2 ml-4 sm:ml-6 text-gray-400 hover:text-gray-500 lg:hidden"
                onClick={() => setMobileFiltersOpen(true)}
              >
                <span className="sr-only">Filters</span>
                <FilterIcon className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>
          </div>

          <section aria-labelledby="products-heading" className="pt-6 pb-24">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-x-8 gap-y-10">
              <form className="hidden lg:block">
                <h3 className="sr-only">Categories</h3>
                <ul className="text-sm font-medium text-gray-900 pb-6 border-b border-gray-200">
                  {categories.map((categoryItem) => (
                    <li
                      key={categoryItem.id}
                      className={`${
                        category.id === categoryItem.id && 'bg-tmdb-blue'
                      } rounded hover:opacity-80`}
                    >
                      <button
                        type="button"
                        onClick={() => {
                          setCategoriy(categoryItem);
                          setCurrentPage(1);
                        }}
                        className="block text-left px-2 py-3 w-full"
                      >
                        {categoryItem.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </form>

              <div className="lg:col-span-3">
                {loading && <Loading opacity={0.3} />}

                {!loading && !error && (
                  <div className="flex flex-wrap justify-center gap-4">
                    {tooltip && (
                      <ReactTooltip place="top" type="dark" effect="solid" />
                    )}
                    {list.map((item) => (
                      <div key={item.id}>
                        <button
                          type="button"
                          onMouseEnter={() => showTooltip(true)}
                          onMouseLeave={() => {
                            showTooltip(false);
                            setTimeout(() => showTooltip(true), 1);
                          }}
                          className="flex w-full justify-end hover:opacity-80"
                        >
                          <XIcon
                            onClick={() => {
                              const itemAction = {
                                ...item,
                                media_type: category.mediaType,
                              };
                              if (type === 'favorite') {
                                Favorite(itemAction);
                              }
                              if (type === 'watchlist') {
                                Watchlist(itemAction);
                              }
                              if (type === 'rated') {
                                Rate(itemAction);
                              }
                            }}
                            className="h-6 w-6"
                            data-tip="Remover da lista"
                            aria-hidden="true"
                          />
                        </button>
                        <div
                          role="presentation"
                          onClick={() => {
                            setItemDetails({
                              ...item,
                              media_type: category.mediaType,
                            });
                            setOpenDetails(true);
                          }}
                        >
                          <CardItem
                            item={{ ...item, media_type: category.mediaType }}
                          />
                        </div>
                      </div>
                    ))}

                    <DetailsItem
                      open={openDetails}
                      onClose={setOpenDetails}
                      item={itemDetails}
                    />

                    {totalPage > currentPage && (
                      <div className="w-full flex justify-center">
                        <button
                          onClick={() => setCurrentPage(currentPage + 1)}
                          type="button"
                          className="bg-tmdb-dark-blue text-white p-2 rounded-lg"
                        >
                          <PlusIcon className="w-5 h-5" aria-hidden="true" />
                        </button>
                      </div>
                    )}
                    {list.length === 0 && (
                      <div
                        className="w-full bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mt-5 mb-10"
                        role="alert"
                      >
                        <strong className="font-bold">Ops! </strong>
                        <span className="block sm:inline">No items found!</span>
                      </div>
                    )}
                  </div>
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
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

MyLists.propTypes = {
  type: PropTypes.string.isRequired,
};

export default MyLists;
