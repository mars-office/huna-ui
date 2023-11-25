import { AuthProvider, AuthProviderProps } from 'react-oidc-context';
import { Suspense, useMemo } from 'react';
import Layout from './Layout';
import { WebStorageStateStore } from 'oidc-client-ts';
import { useNavigate } from 'react-router-dom';
import Loading from './layout/Loading';

export const App = () => {
  const navigate = useNavigate();

  const authConfig: AuthProviderProps = useMemo(() => {
    return {
      authority: window.location.protocol + '//dex.' + window.location.hostname,
      client_id: 'ui',
      redirect_uri: window.location.origin + '/',
      scope: 'openid offline_access profile email',
      response_type: 'code',
      stateStore: new WebStorageStateStore({ store: localStorage }),
      userStore: new WebStorageStateStore({ store: localStorage }),
      automaticSilentRenew: true,
      loadUserInfo: true,
      autoSignIn: false,
      autoSignOut: false,
      onSigninCallback: (user) => {
        window.history.replaceState({}, document.title, window.location.pathname);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (user) {
          const state: any = user?.state;
          if (state.returnTo) {
            navigate(state.returnTo, {
              replace: true,
            });
          } else {
            navigate('/', {
              replace: true,
            });
          }
        }
      },
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AuthProvider {...authConfig}>
      <Suspense fallback={<Loading />}>
        <Layout />
      </Suspense>
    </AuthProvider>
  );
};

export default App;
