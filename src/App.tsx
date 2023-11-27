import Header from './layout/Header';
import Footer from './layout/Footer';
import { hasAuthParams, useAuth } from 'react-oidc-context';
import { useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from './routes/Home';
import Login from './routes/Login';
import Settings from './routes/Settings';
import NotFound from './routes/NotFound';
import ProtectedRoute from './routes/ProtectedRoute';

export const App = () => {
  const auth = useAuth();
  const [hasTriedSignin, setHasTriedSignin] = useState(false);

  useEffect(() => {
    if (
      !hasAuthParams() &&
      !auth.isAuthenticated &&
      !auth.activeNavigator &&
      !auth.isLoading &&
      !auth.error &&
      !hasTriedSignin
    ) {
      setHasTriedSignin(true);
      auth.signinSilent();
    }
  }, [auth, hasTriedSignin]);

  return (
    <>
      <Header auth={auth} />
      <div
        style={{
          flex: '1 1 auto',
          minHeight: '0',
          overflow: 'auto',
          padding: '1rem',
        }}
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/settings"
            element={
              <ProtectedRoute auth={auth}>
                <Settings />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      <Footer />
    </>
  );
};

export default App;
