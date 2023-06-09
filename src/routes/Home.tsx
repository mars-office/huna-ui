import { Button } from '@fluentui/react-components';
import { useCallback } from 'react';
import useUserPreferencesService from '../services/user-preferences.service';

export const Home = () => {
  const { getUserPreferences } = useUserPreferencesService();
  const onUserPreferencesClick = useCallback(async () => {
    const prefs = await getUserPreferences();
    console.log(prefs);
  }, [getUserPreferences]);

  return (
    <div test-id="hello">
      hello aolo home <br />
      <Button onClick={onUserPreferencesClick}>test get user prefs</Button>
    </div>
  );
};

export default Home;
