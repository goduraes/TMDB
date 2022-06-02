/* This example requires Tailwind CSS v2.0+ */
import React, { Fragment, useContext, useState } from 'react';
import { Popover, Transition, Menu } from '@headlessui/react';
import { NavLink, useNavigate } from 'react-router-dom';

import './index.css';

import {
  UserIcon,
  LogoutIcon,
  HeartIcon,
  StarIcon,
  MenuIcon,
  XIcon,
  EyeIcon,
} from '@heroicons/react/outline';
import { ChevronDownIcon, SearchIcon } from '@heroicons/react/solid';

import { AuthContext } from '../../contexts/auth';

const myLists = [
  {
    name: 'Favorites',
    description: "Movies and series you've marked as a favorite.",
    href: '/favorites',
    icon: HeartIcon,
  },
  {
    name: 'Rated',
    description: "Movies, series and episodes you've rated.",
    href: '/rated',
    icon: StarIcon,
  },
  {
    name: 'Watchlist',
    description: 'Movies and series to watch.',
    href: '/watchlist',
    icon: EyeIcon,
  },
];
// const resources = [
//   {
//     name: 'Help Center',
//     description:
//       'Get all of your questions answered in our forums or contact support.',
//     href: '?',
//     icon: SupportIcon,
//   },
// ];

const classNames = (...classes) => {
  return classes.filter(Boolean).join(' ');
};

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [textSearch, setTextSearch] = useState('');

  const search = () => {
    navigate(`/search?q=${textSearch}`);
    setIsSidebarOpen(false);
    setTextSearch('');
  };

  return (
    <>
      <Popover className="relative bg-tmdb-dark-blue border-2 border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-center py-6 md:justify-start md:space-x-10">
            {/* lg:w-0 lg:flex-1 */}
            <div className="flex justify-start">
              <NavLink to="/">
                <img
                  className="h-8 w-auto sm:h-10"
                  src="https://www.themoviedb.org/assets/2/v4/logos/v2/blue_square_1-5bdc75aaebeb75dc7ae79426ddd9be3b2be1e342510f8202baf6bffa71d7f5c4.svg"
                  alt="logo tmdb"
                />
              </NavLink>
            </div>
            <div className=" flex -mr-2 -my-2 md:hidden">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                type="button"
                className="bg-tmdb-dark-blue rounded-md p-2 inline-flex items-center justify-center text-white hover:opacity-80 hover:bg-slate-800 focus:outline-none mr-1"
              >
                <XIcon
                  className={`mt-1 h-5 w-5 ${!isSidebarOpen && 'hidden'}`}
                  aria-hidden="true"
                />
                <SearchIcon
                  className={`mt-1 h-5 w-5 ${isSidebarOpen && 'hidden'}`}
                  aria-hidden="true"
                />
              </button>
              <Popover.Button className="bg-tmdb-dark-blue rounded-md p-2 inline-flex items-center justify-center text-white hover:opacity-80 hover:bg-slate-800 focus:outline-none">
                <span className="sr-only">Open menu</span>
                <MenuIcon className="h-6 w-6" aria-hidden="true" />
              </Popover.Button>
            </div>
            <Popover.Group as="nav" className="hidden md:flex space-x-10">
              <NavLink
                to="/movies"
                className="text-base font-bold text-white hover:opacity-80"
              >
                Movies
              </NavLink>

              <NavLink
                to="/shows"
                className="text-base font-bold text-white hover:opacity-80"
              >
                TV Shows
              </NavLink>

              <Popover className="relative">
                {({ open }) => (
                  <>
                    <Popover.Button
                      className={classNames(
                        open ? 'text-white' : 'text-white',
                        'group bg-tmdb-dark-blue rounded-md inline-flex items-center text-base font-bold hover:opacity-80 outline-none',
                      )}
                    >
                      <span>My Lists</span>
                      <ChevronDownIcon
                        className={classNames(
                          open ? 'text-white' : 'text-white',
                          'ml-2 h-5 w-5 group-hover:opacity-80',
                        )}
                        aria-hidden="true"
                      />
                    </Popover.Button>

                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-200"
                      enterFrom="opacity-0 translate-y-1"
                      enterTo="opacity-100 translate-y-0"
                      leave="transition ease-in duration-150"
                      leaveFrom="opacity-100 translate-y-0"
                      leaveTo="opacity-0 translate-y-1"
                    >
                      <Popover.Panel className="absolute z-30 -ml-4 mt-3 transform px-2 w-screen max-w-md sm:px-0 lg:ml-0 lg:left-1/2 lg:-translate-x-1/2">
                        <div className="rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 overflow-hidden">
                          <div className="relative grid gap-6 bg-tmdb-dark-blue px-5 py-6 sm:gap-8 sm:p-8">
                            {myLists.map((item) => (
                              <NavLink
                                key={item.name}
                                to={item.href}
                                className="-m-3 p-3 flex items-start rounded-lg hover:bg-slate-900	"
                              >
                                <item.icon
                                  className="flex-shrink-0 h-6 w-6 text-green-600"
                                  aria-hidden="true"
                                />
                                <div className="ml-4">
                                  <p className="text-base font-medium text-white">
                                    {item.name}
                                  </p>
                                  <p className="mt-1 text-sm text-white">
                                    {item.description}
                                  </p>
                                </div>
                              </NavLink>
                            ))}
                          </div>
                        </div>
                      </Popover.Panel>
                    </Transition>
                  </>
                )}
              </Popover>
              {/* <Popover className="relative">
                {({ open }) => (
                  <>
                    <Popover.Button
                      className={classNames(
                        open ? 'text-white' : 'text-white',
                        'group bg-tmdb-dark-blue rounded-md inline-flex items-center text-base font-medium hover:opacity-80 focus:outline-none focus:ring-offset-2 focus:ring-green-500',
                      )}
                    >
                      <span>More</span>
                      <ChevronDownIcon
                        className={classNames(
                          open ? 'text-white' : 'text-white',
                          'ml-2 h-5 w-5 group-hover:opacity-80',
                        )}
                        aria-hidden="true"
                      />
                    </Popover.Button>

                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-200"
                      enterFrom="opacity-0 translate-y-1"
                      enterTo="opacity-100 translate-y-0"
                      leave="transition ease-in duration-150"
                      leaveFrom="opacity-100 translate-y-0"
                      leaveTo="opacity-0 translate-y-1"
                    >
                      <Popover.Panel className="absolute z-30 left-1/2 transform -translate-x-1/2 mt-3 px-2 w-screen max-w-md sm:px-0">
                        <div className="rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 overflow-hidden">
                          <div className="relative grid gap-6 bg-tmdb-dark-blue px-5 py-6 sm:gap-8 sm:p-8">
                            {resources.map((item) => (
                              <NavLink
                                key={item.name}
                                to={item.href}
                                className="-m-3 p-3 flex items-start rounded-lg hover:bg-slate-900	"
                              >
                                <item.icon
                                  className="flex-shrink-0 h-6 w-6 text-green-600"
                                  aria-hidden="true"
                                />
                                <div className="ml-4">
                                  <p className="text-base font-medium text-white">
                                    {item.name}
                                  </p>
                                  <p className="mt-1 text-sm text-white">
                                    {item.description}
                                  </p>
                                </div>
                              </NavLink>
                            ))}
                          </div>
                        </div>
                      </Popover.Panel>
                    </Transition>
                  </>
                )}
              </Popover> */}
            </Popover.Group>
            <div className="hidden md:flex items-center justify-end md:flex-1 lg:w-0">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                type="button"
                className="p-2.5 ml-2 text-white border-2 border-transparent rounded-lg focus:outline-none hover:bg-slate-900 mr-2"
              >
                <XIcon
                  className={`icon h-4 w-4 ${!isSidebarOpen && 'hidden'}`}
                  aria-hidden="true"
                />
                <SearchIcon
                  className={`icon h-4 w-4 ${isSidebarOpen && 'hidden'}`}
                  aria-hidden="true"
                />
              </button>
              <Menu as="div" className="relative inline-block text-left">
                <div>
                  <Menu.Button
                    className="icon-user border-2 border-transparent inline-flex justify-center items-center px-4 py-2 text-sm font-medium text-white
                  flex rounded-lg hover:bg-slate-900	"
                  >
                    <UserIcon className="h-4 w-4 mr-1" aria-hidden="true" />
                    <span>{user.username}</span>
                  </Menu.Button>
                </div>

                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="border-2 border-slate-900 origin-top-right mt-1 absolute right-0 w-full rounded-md shadow-lg bg-tmdb-dark-blue ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div>
                      <form>
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              onClick={logout}
                              type="submit"
                              className={classNames(
                                active
                                  ? 'bg-slate-900 text-white'
                                  : 'text-white',
                                'flex items-center w-full text-left px-4 py-2 text-sm',
                              )}
                            >
                              <LogoutIcon
                                className="h-4 w-4 mr-1"
                                aria-hidden="true"
                              />
                              <span>Logout</span>
                            </button>
                          )}
                        </Menu.Item>
                      </form>
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>
            </div>
          </div>
        </div>

        <Transition
          as={Fragment}
          enter="duration-200 ease-out"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="duration-100 ease-in"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <Popover.Panel
            focus
            className="absolute z-30 top-0 inset-x-0 p-2 transition transform origin-top-right md:hidden"
          >
            <div className="rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 bg-tmdb-dark-blue divide-y-2 divide-gray-50">
              <div className="pt-5 pb-6 px-5">
                <div className="flex items-center justify-between">
                  <div>
                    <img
                      className="h-4 w-auto"
                      src="https://www.themoviedb.org/assets/2/v4/logos/v2/blue_short-8e7b30f73a4020692ccca9c88bafe5dcb6f8a62a4c6bc55cd9ba82bb2cd95f6c.svg"
                      alt="TMDB"
                    />
                  </div>
                  <div className="-mr-2">
                    <Popover.Button className="bg-tmdb-dark-blue rounded-md p-2 inline-flex items-center justify-center text-white hover:opacity-80 hover:bg-slate-800	 focus:outline-none">
                      <span className="sr-only">Close menu</span>
                      <XIcon className="h-6 w-6" aria-hidden="true" />
                    </Popover.Button>
                  </div>
                </div>
                <div className="mt-6">
                  <nav className="grid gap-y-8">
                    {myLists.map((item) => (
                      <NavLink
                        key={item.name}
                        to={item.href}
                        className="-m-3 p-3 flex items-center rounded-md hover:bg-slate-900	"
                      >
                        <item.icon
                          className="flex-shrink-0 h-6 w-6 text-green-600"
                          aria-hidden="true"
                        />
                        <span className="ml-3 text-base font-medium text-white">
                          {item.name}
                        </span>
                      </NavLink>
                    ))}
                  </nav>
                </div>
              </div>
              <div className="py-6 px-5 space-y-6">
                <div className="grid grid-cols-2 gap-y-4 gap-x-8">
                  <NavLink
                    to="/movies"
                    className="text-base font-bold text-white text-center hover:opacity-80"
                  >
                    Movies
                  </NavLink>
                  <NavLink
                    to="/shows"
                    className="text-base font-bold text-white text-center hover:opacity-80"
                  >
                    TV Shows
                  </NavLink>
                  {/* {resources.map((item) => (
                    <NavLink
                      key={item.name}
                      to={item.href}
                      className="text-base font-medium text-white hover:opacity-80"
                    >
                      {item.name}
                    </NavLink>
                  ))} */}
                </div>
                <div>
                  <button
                    onClick={logout}
                    type="button"
                    className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md
                      shadow-sm text-base font-medium text-white bg-gray-900 hover:bg-gray-400"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </Popover.Panel>
        </Transition>
      </Popover>

      <Transition
        as={Fragment}
        show={isSidebarOpen}
        enter="transform transition duration-[400ms]"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transform transition duration-[400ms]"
        leaveFrom="opacity-100"
        leaveTo="opacity-0 "
      >
        <div className="px-5 searchBar absolute bg-tmdb-gren w-full z-30">
          <div className="m-5 container mx-auto">
            <label
              htmlFor="default-search"
              className="mb-2 text-sm font-medium text-white sr-only dark:text-white"
            >
              Search
            </label>
            <div className="relative">
              <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none green-tmdb-text">
                <SearchIcon className="h-4 w-4" aria-hidden="true" />
              </div>
              <input
                type="text"
                id="default-search"
                autoComplete="off"
                value={textSearch}
                onChange={(e) => setTextSearch(e.target.value)}
                onKeyPress={(e) => e.charCode === 13 && search()}
                className="block p-4 pl-10 pr-20 w-full bg-gray-50 rounded-lg outline-none"
                placeholder="Search for a movie, tv show, person......"
              />
              <button
                onClick={search}
                type="submit"
                className="bg-tmdb-gren text-white absolute right-2.5 bottom-2.5 hover:opacity-80 font-medium rounded-lg text-sm px-3 py-2"
              >
                Search
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </>
  );
};

export default Navbar;
