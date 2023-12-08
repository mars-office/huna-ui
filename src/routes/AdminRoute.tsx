import { useTranslation } from "react-i18next";
import { Navigate, useLocation } from "react-router-dom";
import { useStore } from "../hooks/use-store";
import { userProfileStore } from "../stores/user-profile.store";

export interface AdminRouteProps {
  children: JSX.Element;
}

export const AdminRoute = (props: AdminRouteProps) => {
  const location = useLocation();
  const {t} = useTranslation();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [userProfile, _] = useStore(userProfileStore);

  if (userProfile && !userProfile.isAdmin) {
    return (
      <Navigate
        to={"/login?returnTo=" + encodeURIComponent(location.pathname)}
        replace
      />
    );
  }

  return (
    <>{!userProfile ? <div>{t('ui.adminRoute.pleaseWait')}...</div> : props.children}</>
  );
};

export default AdminRoute;
