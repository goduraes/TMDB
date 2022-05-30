import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/auth';
import './index.css';

const Login = () => {
  const { authenticated, loadingLogin, errorMessage, login } =
    useContext(AuthContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (authenticated) {
      navigate('/');
    }
  }, []);

  const handleSubmit = async () => {
    login(username, password);
  };

  return (
    <div id="Login" className="flex flex-col p-2 h-screen">
      <div className="m-auto">
        <div className="p-5 my-5 rounded">
          <img
            src="https://www.themoviedb.org/assets/2/v4/logos/v2/blue_square_2-d537fb228cf3ded904ef09b136fe3fec72548ebc1fea3fbbd1ad9e36364db38b.svg"
            className="m-auto mb-5"
            width={100}
            alt="Logo TMDB"
          />

          <div>
            <label className="block mb-2" htmlFor="username">
              Username
            </label>
            <input
              type="text"
              id="username"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={`border rounded py-2 px-3 w-full focus:shadow-outline focus:border-gray-400 focus:outline-none
              ${!!errorMessage && 'border-red-500'}`}
            />
          </div>
          <div className="py-2">
            <label className="block mb-2" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="****************"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`border rounded py-2 px-3 w-full focus:shadow-outline focus:border-gray-400 focus:outline-none
              ${!!errorMessage && 'border-red-500'}`}
            />
          </div>
          <div className="py-2">
            <button
              type="button"
              className={`w-full rounded bg-green-500 text-white font-bold py-2 px-4 border-solid border-2 border-green-600
              ${loadingLogin ? 'opacity-70' : 'hover:bg-green-700'}`}
              onClick={handleSubmit}
              disabled={loadingLogin}
            >
              {loadingLogin ? (
                <svg
                  role="status"
                  className="inline w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-gray-600 dark:fill-gray-300"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="#FFF"
                  />
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentFill"
                  />
                </svg>
              ) : (
                'Login'
              )}
            </button>
            <p className="mt-1 text-red-500 text-center text-xs italic">
              {errorMessage}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
