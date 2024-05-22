import { AuthProvider, AuthProviderProps } from 'react-oidc-context';
import { WebStorageStateStore } from 'oidc-client-ts';
import PwaUpdate from './layout/PwaUpdate';
import { FluentProvider, Theme, teamsDarkTheme, teamsLightTheme } from '@fluentui/react-components';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { useCallback, useEffect, useState } from 'react';
import { usePrefersDarkMode } from './hooks/use-prefers-dark-mode';
import { AppTheme } from './models/app-theme';

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
  const [appTheme, setAppTheme] = useState<AppTheme>(localStorage.getItem('appTheme') ? (localStorage.getItem('appTheme') as AppTheme) : 'auto');
  const [fluentTheme, setFluentTheme] = useState<Theme>(teamsLightTheme);
  const prefersDarkMode = usePrefersDarkMode();

  useEffect(() => {
    if (appTheme === 'auto') {
      setFluentTheme(prefersDarkMode ? teamsDarkTheme : teamsLightTheme);
      return;
    }
    setFluentTheme(appTheme === 'light' ? teamsLightTheme : teamsDarkTheme);
  }, [appTheme, prefersDarkMode]);

  const themeSwitched = useCallback((theme: AppTheme) => {
    setAppTheme(theme);
    localStorage.setItem('appTheme', theme);
  }, [setAppTheme]);

  return <>
    <FluentProvider
    style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
    }}
    theme={fluentTheme}
  >
    <PwaUpdate />
    <BrowserRouter>
      <AuthProvider {...authConfig}>
        <App appTheme={appTheme} onSwitchTheme={themeSwitched} />
      </AuthProvider>
    </BrowserRouter>
  </FluentProvider>
  </>
}
export default Root;