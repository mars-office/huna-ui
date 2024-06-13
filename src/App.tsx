import Header from './layout/Header';
import Footer from './layout/Footer';
import { useState, lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from './routes/Home';
import Login from './routes/Login';
import Settings from './routes/Settings';
import NotFound from './routes/NotFound';
import ProtectedRoute from './routes/ProtectedRoute';
import Sidebar from './layout/Sidebar';
import Loading from './layout/Loading';
import { Toaster } from '@fluentui/react-components';
import { AppTheme } from './models/app-theme';
import environment from './environment';
import FromNotification from './layout/FromNotification';
import Tos from './routes/Tos';
import RequestPushNotifications from './layout/RequestPushNotifications';
import useAuthLifecycle from './hooks/use-auth-lifecycle';
import useSignalrConnection from './hooks/use-signalr-connection';

// Lazy loading
const Admin = lazy(() => import('./_admin/routes/Admin'));

export interface AppProps {
  onSwitchTheme: (theme: AppTheme) => void;
  appTheme: AppTheme;
}

export const App = (props: AppProps) => {
  const { canDisplayContent, logout } = useAuthLifecycle();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useSignalrConnection();

  return (
    <>
      <RequestPushNotifications />
      <Toaster
        limit={5}
        position="bottom-end"
        pauseOnHover={true}
        pauseOnWindowBlur={true}
        timeout={environment.toast.timeout}
        toasterId="toaster"
      />
      <Sidebar dismissed={() => setSidebarOpen(false)} open={sidebarOpen} />
      <Header
        logout={logout}
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
            <Route path="tos" element={<Tos />} />
            <Route
              path="settings"
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              }
            />
            <Route
              path="fromNotification/:id"
              element={
                <ProtectedRoute>
                  <FromNotification />
                </ProtectedRoute>
              }
            />
            <Route
              path="admin/*"
              element={
                <ProtectedRoute adminRequired={true}>
                  <Suspense fallback={<Loading />}>
                    <Admin />
                  </Suspense>
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
