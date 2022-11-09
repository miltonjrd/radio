import axios from 'axios';

const api = () => {
  const authToken = sessionStorage.getItem('auth');
  const URL = 'http://localhost:8000';
  const baseURL = URL+'/api';
  
  axios.defaults.baseURL = baseURL;
  axios.defaults.headers.common['Authorization'] = authToken;

  const get = async (uri, body) => {
    let data = null;
    let error = null;
    try {
      const res = await axios.get(uri, body);
      data = res.data;
    } catch (err) {
      error = err.response.data;
    }

    return {
      data,
      error
    };
  };

  const post = async (uri, body, headers) => {
    let data = null;
    let error = null;
    try {
      const res = await axios.post(uri, body, headers);
      data = res.data;
    } catch (err) {
      error = err.response.data;
    }

    return {
      data,
      error
    };
  };
  
  const put = async (uri, body) => {
    let data = null;
    let error = null;
    try {
      const res = await axios.put(uri, body);
      data = res.data;
    } catch (err) {
      error = err.response.data;
    }

    return {
      data,
      error
    };
  };

  const del = async (uri, body) => {
    let data = null;
    let error = null;
    try {
      const res = await axios.delete(uri, body);
      data = res.data;
    } catch (err) {
      error = err.response.data;
    }

    return {
      data,
      error
    };
  };


  const media = (path) => {
    return URL+'/storage/'+path;
  };

  return {
    axios,
    get,
    post,
    put,
    del,
    media
  };
};

export default api();