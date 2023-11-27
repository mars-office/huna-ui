import { useTranslation } from "react-i18next";
import { AuthContextProps } from "react-oidc-context";
import { Navigate, useLocation } from "react-router-dom";

export interface ProtectedRouteProps {
  auth: AuthContextProps;
  children: JSX.Element;
}

export const ProtectedRoute = (props: ProtectedRouteProps) => {
  const location = useLocation();
  const {t} = useTranslation();

  if (!props.auth.isLoading && !props.auth.isAuthenticated) {
    return (
      <Navigate
        to={"/login?returnTo=" + encodeURIComponent(location.pathname)}
        replace
      />
    );
  }

  return (
    <>{props.auth.isLoading ? <div>{t('ui.protectedRoute.pleaseWait')}...</div> : props.children}</>
  );
};

export default ProtectedRoute;
