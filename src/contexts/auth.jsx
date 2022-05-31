import React, { useState, useEffect, createContext } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../service/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loadingLogin, setLoadingLogin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  // cria o token
  const createRequestToken = async () => {
    // gera o token de requisição
    const requestToken = await API.get(
      `/authentication/token/new?api_key=${process.env.REACT_APP_API_KEY}`,
    );
    return requestToken;
  };

  // cria a sessão com o token de requisição validado via login
  const createSession = async (requestToken) => {
    const session = await API.post(
      `/authentication/session/new?api_key=${process.env.REACT_APP_API_KEY}`,
      { request_token: requestToken },
    );
    return session;
  };

  // pega informações do usuário via token de sessao
  const getUser = async (session) => {
    await API.get(
      `/account?api_key=${process.env.REACT_APP_API_KEY}&session_id=${session}`,
    )
      .then(async (resp) => {
        const loggedUser = resp.data;
        loggedUser.session_id = session;
        localStorage.setItem('user', JSON.stringify(loggedUser));
        setUser(loggedUser);
        navigate('/');
      })
      .catch(() => {
        setErrorMessage('Oops! Something went wrong, try again.');
        navigate('/login');
      });
  };

  // faz o login validando o token de requisição
  const login = async (username, password) => {
    setLoadingLogin(true);
    // pega o request token
    const requestToken = await createRequestToken();
    // faz a requisição de login
    await API.post(
      `/authentication/token/validate_with_login?api_key=${process.env.REACT_APP_API_KEY}`,
      {
        username,
        password,
        request_token: requestToken.data.request_token,
      },
    )
      .then(async (resp) => {
        if (resp.data.success) {
          const session = await createSession(resp.data.request_token);
          if (session.data.success) {
            await getUser(session.data.session_id);
          } else {
            setErrorMessage('Oops! Something went wrong, try again.');
          }
        } else {
          setErrorMessage('Oops! Something went wrong, try again.');
        }
      })
      .catch((err) => {
        setErrorMessage(err.response.data.status_message);
      })
      .finally(() => {
        setLoadingLogin(false);
      });
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  useEffect(() => {
    const recoveredUser = localStorage.getItem('user');
    setUser({});
    if (recoveredUser) {
      const userParse = JSON.parse(recoveredUser);
      if (userParse.session_id) {
        getUser(userParse.session_id);
      } else {
        navigate('/login');
      }
    }
    setLoading(false);
  }, []);

  return (
    <AuthContext.Provider
      // eslint-disable-next-line react/jsx-no-constructed-context-values
      value={{
        authenticated: !!user,
        loading,
        setLoading,
        loadingLogin,
        errorMessage,
        user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
