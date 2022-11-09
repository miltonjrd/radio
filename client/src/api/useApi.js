import useSWR from 'swr';
import axios from 'axios';

const useApi = ({method, url}) => {
  const authToken = sessionStorage.getItem('auth');
  const baseURL = 'http://localhost:8000/api';
  
  axios.defaults.baseURL = baseURL;
  axios.defaults.headers.common['Authorization'] = authToken;

  const fetcher = url => axios[method](url).then(res => res.data);
  
  const { data, error } = useSWR(url, fetcher);
  
  return { data, error };
};

export default useApi;