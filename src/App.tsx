import Header from './layout/Header';
import Footer from './layout/Footer';
import { hasAuthParams, useAuth } from 'react-oidc-context';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import Home from './routes/Home';
import Login from './routes/Login';
import Settings from './routes/Settings';
import NotFound from './routes/NotFound';
import ProtectedRoute from './routes/ProtectedRoute';
import { useStore } from './hooks/use-store';
import { userStore } from './stores/user.store';
import { User } from 'oidc-client-ts';

export const App = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const [hasTriedSignin, setHasTriedSignin] = useState(false);

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
      auth.signinSilent();
    }
  }, [auth, hasTriedSignin]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setUserStoreUser] = useStore(userStore);

  useEffect(() => {
    setUserStoreUser(!auth.user ? undefined : auth.user);
  }, [auth.user, setUserStoreUser]);

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
    return (
      (!auth.user && !auth.isAuthenticated) ||
      (auth.user && !auth.isAuthenticated && hasTriedSignin) ||
      auth.isAuthenticated
    );
  }, [auth, hasTriedSignin]);

  return (
    <>
      <Header />
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
            <Route path="/login" element={<Login />} />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <Settings />
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
