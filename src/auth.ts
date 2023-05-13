import { AuthProviderProps } from "oidc-react";

export const authConfig: AuthProviderProps = {
  authority: window.location.protocol + "//dex." + window.location.hostname,
  clientId: "ui",
  redirectUri: window.location.origin + "/",
  autoSignIn: false,
  autoSignOut: false,
  scope: "openid offline_access profile email",
  responseType: "code",
  onSignIn: () => {
    if (location.href.includes("?")) {
      history.pushState({}, "", location.href.split("?")[0]);
    }
  },
};
