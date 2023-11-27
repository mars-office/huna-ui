import axios from 'axios';
import { userStore } from '../stores/user.store';

export const enableAuthInterceptor = () => {
  axios.interceptors.request.use(
    (request) => {
      const token = userStore.value?.access_token;
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
