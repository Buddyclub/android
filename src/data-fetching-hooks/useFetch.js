import useSWR from 'swr';
import axios from 'axios';
import defaulUrl from '../config/url';

export const axiosInstance = axios.create({
  // baseURL: "http://localhost:8002/",
  baseURL: defaulUrl.baseUrl,
  timeout: 30000,
  headers: {
    Accept: 'application/vnd.github.v3+json',
    'Content-Type': 'application/json',
  },
  responseType: 'json',
});

export const useFetch = (opts, route, method, data) => {
  let fetcher;
  switch (method) {
    case 'GET':
      fetcher = async url => {
        const res = await axiosInstance.get(url);
        return res.data;
      };
      break;

    case 'PUT':
      fetcher = url => axiosInstance.put(url, data).then(res => res.data);
      break;

    case 'DELETE':
      fetcher = url => axiosInstance.delete(url).then(res => res.data);
      break;

    default:
      fetcher = url => axiosInstance.post(url, data).then(res => res.data);
      break;
  }

  return useSWR(`${route}`, fetcher, {...opts});
};
