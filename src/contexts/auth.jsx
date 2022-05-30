import React, { useState, createContext } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../service/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loadingLogin, setLoadingLogin] = useState(false);
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
        const userInfo = resp.data;
        userInfo.session_id = session;
        setUser(userInfo);
        navigate('/');
      })
      .catch(() => {
        setErrorMessage('Oops! Something went wrong, try again.');
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
    setUser(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider
      // eslint-disable-next-line react/jsx-no-constructed-context-values
      value={{
        authenticated: !!user,
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
