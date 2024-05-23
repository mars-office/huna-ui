import Header from './layout/Header';
import Footer from './layout/Footer';
import { hasAuthParams, useAuth } from 'react-oidc-context';
import { useCallback, useEffect, useMemo, useState, lazy, Suspense } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import Home from './routes/Home';
import Login from './routes/Login';
import Settings from './routes/Settings';
import NotFound from './routes/NotFound';
import ProtectedRoute from './routes/ProtectedRoute';
import { useStore } from './hooks/use-store';
import { userStore } from './stores/user.store';
import { User } from 'oidc-client-ts';
import { userProfileStore } from './stores/user-profile.store';
import usersService from './services/users.service';
import Sidebar from './layout/Sidebar';
import Loading from './layout/Loading';
import AdminRoute from './routes/AdminRoute';
import { Toaster } from '@fluentui/react-components';
import signalrService from './services/signalr.service';
import pushService from './services/push.service';
import { AppTheme } from './models/app-theme';

// Lazy loading
const Admin = lazy(() => import('./_admin/routes/Admin'));

export interface AppProps {
  onSwitchTheme: (theme: AppTheme) => void;
  appTheme: AppTheme;
}

export const App = (props: AppProps) => {
  const auth = useAuth();
  const navigate = useNavigate();
  const [hasTriedSignin, setHasTriedSignin] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (
      !hasAuthParams() &&
      !auth.isAuthenticated &&
      !auth.activeNavigator &&
      !auth.isLoading &&
      auth.user &&
      !hasTriedSignin
    ) {
      setHasTriedSignin(true);
      auth.signinSilent().catch((e) => {
        console.error(e);
        auth.signoutRedirect().then(() => {
          navigate('/login');
        });
      });
    }
  }, [auth, hasTriedSignin, navigate]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setUserStoreUser] = useStore(userStore);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [__, setUserProfile] = useStore(userProfileStore);

  useEffect(() => {
    if (auth.isLoading) {
      return;
    }
    setUserStoreUser(!auth.user ? undefined : auth.user);
  }, [auth.user, setUserStoreUser]);

  useEffect(() => {
    if (auth.isLoading) {
      return;
    }
    (async () => {
      if (auth.isAuthenticated && auth.user) {
        console.log('Reading user profile...');
        const userProfileResult = await usersService.myProfile();
        setUserProfile(userProfileResult);
      } else {
        console.log('Unloading user profile...');
        setUserProfile(undefined);
      }
    })();
  }, [auth, setUserProfile]);

  useEffect(() => {
    if (auth.isLoading) {
      return;
    }
    (async () => {
      if (auth.isAuthenticated && auth.user) {
        console.log('Connecting to SignalR...');
        await signalrService.connect();
      } else {
        console.log('Disconnecting from SignalR...');
        await signalrService.disconnect();
      }
    })();
  }, [auth]);

  useEffect(() => {
    if (auth.isLoading) {
      return;
    }
    (async () => {
      if (auth.isAuthenticated && auth.user) {
        console.log('Setting up push subscription...');
        await pushService.subscribe();
      } else {
        console.log('Removing push subscription...');
        await pushService.unsubscribe();
      }
    })();
  }, [auth]);

  const userLoadedCallback = useCallback(
    (u: User) => {
      const state: any = u?.state;
      if (state?.returnTo) {
        navigate(state.returnTo);
      }
    },
    [navigate],
  );

  useEffect(() => {
    auth.events.addUserLoaded(userLoadedCallback);
    return () => {
      auth.events.removeUserLoaded(userLoadedCallback);
    };
  }, [auth, userLoadedCallback]);

  const canDisplayContent = useMemo(() => {
    if (auth.isLoading) {
      return false;
    }
    return (
      (!auth.user && !auth.isAuthenticated) ||
      (auth.user && !auth.isAuthenticated && hasTriedSignin) ||
      auth.isAuthenticated
    );
  }, [auth, hasTriedSignin]);

  return (
    <>
      <Toaster toasterId="toaster" />
      <Sidebar dismissed={() => setSidebarOpen(false)} open={sidebarOpen} />
      <Header
        appTheme={props.appTheme}
        onSwitchTheme={props.onSwitchTheme}
        menuClick={() => setSidebarOpen((s) => !s)}
      />
      <div
        style={{
          flex: '1 1 auto',
          minHeight: '0',
          overflow: 'auto',
          padding: '1rem',
        }}
      >
        {canDisplayContent && (
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route
              path="settings"
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              }
            />
            <Route
              path="admin/*"
              element={
                <ProtectedRoute>
                  <AdminRoute>
                    <Suspense fallback={<Loading />}>
                      <Admin />
                    </Suspense>
                  </AdminRoute>
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        )}
      </div>
      <Footer />
    </>
  );
};

export default App;
