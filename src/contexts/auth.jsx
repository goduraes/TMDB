import React, { useState, useEffect, createContext, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { API } from '../service/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loadingLogin, setLoadingLogin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  // cria o token
  const createRequestToken = async () => {
    const requestToken = await API.get(
      `/authentication/token/new?api_key=${process.env.REACT_APP_API_KEY}`,
    ).catch((error) => {
      setErrorMessage(
        error.response.data.status_message
          ? error.response.data.status_message
          : 'Oops! Something went wrong, try again.',
      );
      setLoadingLogin(false);
    });
    return requestToken;
  };

  // cria a sessão com o token de requisição validado via login
  const createSession = async (requestToken) => {
    const session = await API.post(
      `/authentication/session/new?api_key=${process.env.REACT_APP_API_KEY}`,
      { request_token: requestToken },
    ).catch((error) => {
      setErrorMessage(
        error.response.data.status_message
          ? error.response.data.status_message
          : 'Oops! Something went wrong, try again.',
      );
      setLoadingLogin(false);
    });
    return session;
  };

  // pega informações do usuário via token de sessao
  const getUser = async (session, login) => {
    setLoading(true);
    await API.get(
      `/account?api_key=${process.env.REACT_APP_API_KEY}&session_id=${session}`,
    )
      .then(async (resp) => {
        const loggedUser = resp.data;
        loggedUser.session_id = session;
        localStorage.setItem('user', JSON.stringify(loggedUser));
        setUser(loggedUser);
        if (login) navigate('/');
      })
      .catch(() => {
        if (login) {
          setErrorMessage('Oops! Something went wrong, try again.');
        }
        logout();
      })
      .finally(() => {
        setLoading(false);
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
            await getUser(session.data.session_id, true);
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

  useEffect(() => {
    const recoveredUser = localStorage.getItem('user');
    setUser(recoveredUser);
    if (recoveredUser) {
      const userParse = JSON.parse(recoveredUser);
      if (userParse.session_id) {
        getUser(userParse.session_id);
      } else {
        logout();
      }
    } else {
      setLoading(false);
    }
  }, []);

  const contextData = useMemo(
    () => ({
      authenticated: !!user,
      loading,
      setLoading,
      loadingLogin,
      errorMessage,
      user,
      login,
      logout,
    }),
    [user, loadingLogin, loading, errorMessage],
  );

  return (
    <AuthContext.Provider value={contextData}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
