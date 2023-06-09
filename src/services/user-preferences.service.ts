import axios from 'axios';
import { useCallback } from 'react';

export const useUserPreferencesService = () => {
  const getUserPreferences = useCallback(async () => {
    const response = await axios.get('/api/user-preferences/user-preferences');
    return response.data;
  }, []);

  return {
    getUserPreferences,
  };
};

export default useUserPreferencesService;
