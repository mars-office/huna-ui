import { WebStorageStateStore } from "oidc-client-ts";
import { AuthProviderProps } from "react-oidc-context";

export const authConfig: AuthProviderProps = {
  authority: window.location.protocol + '//idp.' + window.location.hostname,
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

export default authConfig;