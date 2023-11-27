import ReactDOM from 'react-dom/client';
import { FluentProvider, teamsDarkTheme } from '@fluentui/react-components';
import App from './App';
import { BrowserRouter } from 'react-router-dom';

import './i18n';
import enableAuthInterceptor from './services/auth.interceptor';
import { AuthProvider, AuthProviderProps } from 'react-oidc-context';
import { WebStorageStateStore } from 'oidc-client-ts';

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

enableAuthInterceptor();

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <FluentProvider
    style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
    }}
    theme={teamsDarkTheme}
  >
    <BrowserRouter>
      <AuthProvider {...authConfig}>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </FluentProvider>,
);
