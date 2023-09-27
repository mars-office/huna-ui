import axios from 'axios';

export const enableAuthInterceptor = (token: string | undefined) => {
  axios.interceptors.request.use(
    (request) => {
      if (token) {
        request.headers['Authorization'] = `Bearer ${token}`;
      }
      return request;
    },
    (error) => {
      return Promise.reject(error);
    },
  );
};

export default enableAuthInterceptor;
