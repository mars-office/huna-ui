import { Navigate, useLocation } from 'react-router-dom';
import { useStore } from '../hooks/use-store';
import { userProfileStore } from '../stores/user-profile.store';
import Loading from '../layout/Loading';

export interface AdminRouteProps {
  children: JSX.Element;
}

export const AdminRoute = (props: AdminRouteProps) => {
  const location = useLocation();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [userProfile, _] = useStore(userProfileStore);

  if (userProfile && !userProfile.isAdmin) {
    return <Navigate to={'/login?returnTo=' + encodeURIComponent(location.pathname)} replace />;
  }

  return (
    <>
      {!userProfile ? (
        <Loading />
      ) : (
        props.children
      )}
    </>
  );
};

export default AdminRoute;
