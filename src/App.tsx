import { AuthProvider, AuthProviderProps } from "oidc-react";
import { useMemo } from "react";
import Layout from "./Layout";
import { useNavigate } from "react-router-dom";

export const App = () => {
  const navigate = useNavigate();

  const authConfig: AuthProviderProps = useMemo(() => {
    return {
      authority: window.location.protocol + "//dex." + window.location.hostname,
      clientId: "ui",
      redirectUri: window.location.origin + "/",
      autoSignIn: false,
      autoSignOut: false,
      scope: "openid offline_access profile email",
      responseType: "code",
      onSignIn: (user) => {
        // if (location.href.includes("?")) {
        //   history.pushState({}, "", location.href.split("?")[0]);
        // }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const state: any = user?.state;
        if (state.returnTo) {
          navigate(state.returnTo, {
            replace: true
          });
        }
      },
    };
  }, [navigate]);

  return (
    <AuthProvider {...authConfig}>
      <Layout />
    </AuthProvider>
  );
};

export default App;
