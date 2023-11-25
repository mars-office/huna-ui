import { AuthProvider, AuthProviderProps, UserManager } from 'oidc-react';
import { Suspense, useMemo } from 'react';
import Layout from './Layout';
import { WebStorageStateStore } from 'oidc-client-ts';
import { useNavigate } from 'react-router-dom';
import Loading from './layout/Loading';

export const App = () => {
  const navigate = useNavigate();

  const authConfig: AuthProviderProps = useMemo(() => {
    return {
      userManager: new UserManager({
        authority: window.location.protocol + '//dex.' + window.location.hostname,
        client_id: 'ui',
        redirect_uri: window.location.origin + '/',
        scope: 'openid offline_access profile email',
        response_type: 'code',
        stateStore: new WebStorageStateStore({ store: localStorage }),
        userStore: new WebStorageStateStore({ store: localStorage }),
      }),
      autoSignIn: false,
      autoSignOut: false,
      onSignIn: (user) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
      },
    };
  }, [navigate]);

  return (
    <AuthProvider {...authConfig}>
      <Suspense fallback={<Loading />}>
        <Layout />
      </Suspense>
    </AuthProvider>
  );
};

export default App;
