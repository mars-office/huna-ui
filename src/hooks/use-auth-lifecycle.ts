import { useCallback, useEffect, useMemo, useState } from 'react';
import { hasAuthParams, useAuth } from 'react-oidc-context';
import { useNavigate } from 'react-router-dom';
import { useStore } from './use-store';
import { userStore } from '../stores/user.store';
import { userProfileStore } from '../stores/user-profile.store';
import opaService from '../services/opa.service';
import { User } from 'oidc-client-ts';
import pushService from '../services/push.service';

export const useAuthLifecycle = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const [hasTriedSignin, setHasTriedSignin] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setUserStoreUser] = useStore(userStore);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [__, setUserProfile] = useStore(userProfileStore);

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
      auth.signinSilent().catch((e: any) => {
        console.error(e);
        auth.signoutRedirect().then(() => {
          navigate('/login');
        });
      });
    }
  }, [auth, hasTriedSignin, navigate]);

  useEffect(() => {
    if (auth.isLoading) {
      return;
    }
    setUserStoreUser(!auth.user ? undefined : auth.user);
  }, [auth.user, setUserStoreUser, auth.isLoading]);

  useEffect(() => {
    if (auth.isLoading) {
      return;
    }
    (async () => {
      if (auth.isAuthenticated && auth.user) {
        console.log('Reading user profile...');
        const userProfileResult = await opaService.publicAuthz(auth.user!.access_token);
        setUserProfile(userProfileResult);
      } else {
        console.log('Unloading user profile...');
        setUserProfile(undefined);
      }
    })();
  }, [auth, setUserProfile]);

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
    if (auth.isLoading) {
      return false;
    }
    return (
      (!auth.user && !auth.isAuthenticated) ||
      (auth.user && !auth.isAuthenticated && hasTriedSignin) ||
      auth.isAuthenticated
    );
  }, [auth, hasTriedSignin]);

  const logout = useCallback(async () => {
    try {
      const existingSubscription = await pushService.getExistingSubscription();
      if (existingSubscription) {
        await pushService.unsubscribe();
      }
    } catch (err: any) {
      // ignored
      console.error(err);
    }
    localStorage.removeItem('pushAllowed');
    await auth.removeUser();
    navigate('/');
  }, [auth, navigate]);

  return {
    canDisplayContent,
    auth,
    logout
  }
};

export default useAuthLifecycle;
