import axios from 'axios';

export const API = axios.create({
  baseURL: 'https://api.themoviedb.org/3/',
});

export const GetTrending = async (type) => {
  return API.get(
    `/trending/${type}/day?api_key=${process.env.REACT_APP_API_KEY}`,
  );
};
