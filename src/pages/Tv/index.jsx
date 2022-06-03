import React, { Fragment, useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Dialog, Transition } from '@headlessui/react';
import { XIcon } from '@heroicons/react/outline';
import { FilterIcon, PlusIcon } from '@heroicons/react/solid';
import Loading from '../../components/Loading';
import CardItem from '../../components/CardItem';
import DetailsItem from '../../components/DetailsItem';
import API from '../../service/api';

const categories = [
  { name: 'Movies', id: 'movie' },
  { name: 'TV Shows', id: 'tv' },
  { name: 'People', id: 'person' },
];

const Search = () => {
  const [searchParams] = useSearchParams();

  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [category, setCategoriy] = useState('movie');
  const [resultsSearch, setResultsSearch] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [openDetails, setOpenDetails] = useState(false);
  const [itemDetails, setItemDetails] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const [qParams, setQParams] = useState(0);

  useEffect(() => {
    const q = searchParams.get('q');
    setQParams(q);

    if (qParams !== q) {
      setCurrentPage(1);
    }

    if (currentPage === 1) {
      document.body.classList.add('overflow-hidden');
      setLoading(true);
    }
    API.get(
      `/search/${category}?query=${q}&api_key=${process.env.REACT_APP_API_KEY}&page=${currentPage}`,
    )
      .then((resp) => {
        const arrayConcat = resultsSearch.concat(resp.data.results);
        setResultsSearch(
          resp.data.page === 1 ? resp.data.results : arrayConcat,
        );
        setTotalPage(resp.data.total_pages);
      })
      .catch(() => {
        setError(true);
      })
      .finally(() => {
        setTimeout(() => {
          document.body.classList.remove('overflow-hidden');
          setLoading(false);
        }, 500);
      });
  }, [category, searchParams, currentPage]);

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
                            category === categoryItem.id && 'bg-tmdb-blue'
                          } rounded hover:opacity-80`}
                        >
                          <button
                            type="button"
                            onClick={() => {
                              setCategoriy(categoryItem.id);
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
            <h1 className="text-2xl font-bold text-gray-800 py-4">
              Search Results
            </h1>

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
                        category === categoryItem.id && 'bg-tmdb-blue'
                      } rounded hover:opacity-80`}
                    >
                      <button
                        type="button"
                        onClick={() => {
                          setCategoriy(categoryItem.id);
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
                    {resultsSearch.map((item) => (
                      <div
                        key={item.id}
                        role="presentation"
                        onClick={() => {
                          setItemDetails({ ...item, media_type: category });
                          setOpenDetails(true);
                        }}
                      >
                        <CardItem item={{ ...item, media_type: category }} />
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

export default Search;
