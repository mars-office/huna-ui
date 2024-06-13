import { useAuth } from 'react-oidc-context';
import { Navigate, useLocation } from 'react-router-dom';
import Loading from '../layout/Loading';
import { useStore } from '../hooks/use-store';
import { userProfileStore } from '../stores/user-profile.store';
import { useMemo } from 'react';

export interface ProtectedRouteProps {
  children: JSX.Element;
  adminRequired?: boolean;
}

export const ProtectedRoute = (props: ProtectedRouteProps) => {
  const location = useLocation();
  const auth = useAuth();
  const [userProfile] = useStore(userProfileStore);

  const isLoading = useMemo(() => {
    return auth.isLoading || userProfile.isLoading;
  }, [auth.isLoading, userProfile]);

  if (!isLoading && 
    (
      !auth.isAuthenticated ||
      (props.adminRequired && !userProfile.data!.isAdmin)
    )
  ) {
    return <Navigate to={'/login?returnTo=' + encodeURIComponent(location.pathname + location.search)} replace />;
  }

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        props.children
      )}
    </>
  );
};

export default ProtectedRoute;
