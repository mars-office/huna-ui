import { useTranslation } from "react-i18next";
import { useAuth } from "react-oidc-context";
import { Navigate, useLocation } from "react-router-dom";

export interface ProtectedRouteProps {
  children: JSX.Element;
}

export const ProtectedRoute = (props: ProtectedRouteProps) => {
  const location = useLocation();
  const {t} = useTranslation();
  const auth = useAuth();

  if (!auth.isLoading && !auth.isAuthenticated) {
    return (
      <Navigate
        to={"/login?returnTo=" + encodeURIComponent(location.pathname)}
        replace
      />
    );
  }

  return (
    <>{auth.isLoading ? <div>{t('ui.protectedRoute.pleaseWait')}...</div> : props.children}</>
  );
};

export default ProtectedRoute;
