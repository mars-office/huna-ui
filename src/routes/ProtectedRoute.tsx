import { AuthContextProps } from "oidc-react";
import { Navigate, useLocation } from "react-router-dom";

export interface ProtectedRouteProps {
  auth: AuthContextProps;
  children: JSX.Element;
}

export const ProtectedRoute = (props: ProtectedRouteProps) => {
    const location = useLocation();

  if (!props.auth.userData?.profile) {
    return <Navigate to={"/login?returnTo=" + encodeURIComponent(location.pathname)}  replace />;
  }

  return props.children;
};

export default ProtectedRoute;
