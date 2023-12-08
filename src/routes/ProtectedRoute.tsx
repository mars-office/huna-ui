import { useAuth } from 'react-oidc-context';
import { Navigate, useLocation } from 'react-router-dom';
import Loading from '../layout/Loading';

export interface ProtectedRouteProps {
  children: JSX.Element;
}

export const ProtectedRoute = (props: ProtectedRouteProps) => {
  const location = useLocation();
  const auth = useAuth();

  if (!auth.isLoading && !auth.isAuthenticated) {
    return <Navigate to={'/login?returnTo=' + encodeURIComponent(location.pathname)} replace />;
  }

  return (
    <>
      {auth.isLoading ? (
        <Loading />
      ) : (
        props.children
      )}
    </>
  );
};

export default ProtectedRoute;
