import { AuthProvider, AuthProviderProps } from 'react-oidc-context';
import { WebStorageStateStore } from 'oidc-client-ts';
import PwaUpdate from './layout/PwaUpdate';
import { FluentProvider, teamsDarkTheme, teamsLightTheme } from '@fluentui/react-components';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { useCallback, useEffect, useState } from 'react';

const authConfig: AuthProviderProps = {
  authority: window.location.protocol + '//dex.' + window.location.hostname,
  client_id: 'ui',
  redirect_uri: window.location.origin + '/',
  scope: 'openid offline_access profile email',
  response_type: 'code',
  stateStore: new WebStorageStateStore({ store: localStorage }),
  userStore: new WebStorageStateStore({ store: localStorage }),
  automaticSilentRenew: true,
  loadUserInfo: true,
  accessTokenExpiringNotificationTimeInSeconds: 30,
  refreshTokenAllowedScope: 'openid offline_access profile email',
  includeIdTokenInSilentRenew: true,
  onSigninCallback: () => {
    window.history.replaceState({}, document.title, window.location.pathname);
  },
};


export const Root = () => {
  const [useDarkTheme, setUseDarkTheme] = useState(false);

  useEffect(() => {
    const useDarkThemeLocalStorage = localStorage.getItem('useDarkTheme');
    if (useDarkThemeLocalStorage && useDarkThemeLocalStorage === 'yes') {
      setUseDarkTheme(true);
    }
  }, []);

  const themeSwitched = useCallback((theme: 'light' | 'dark') => {
    if (theme === 'light') {
      if (useDarkTheme) {
        localStorage.setItem('useDarkTheme', 'no');
        setUseDarkTheme(false);
      }
    } else {
      if (!useDarkTheme) {
        localStorage.setItem('useDarkTheme', 'yes');
        setUseDarkTheme(true);
      }
    }
  }, [useDarkTheme, setUseDarkTheme]);

  return <>
    <FluentProvider
    style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
    }}
    theme={useDarkTheme ? teamsDarkTheme : teamsLightTheme}
  >
    <PwaUpdate />
    <BrowserRouter>
      <AuthProvider {...authConfig}>
        <App useDarkTheme={useDarkTheme} onSwitchTheme={themeSwitched} />
      </AuthProvider>
    </BrowserRouter>
  </FluentProvider>
  </>
}
export default Root;