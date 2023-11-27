import Header from './layout/Header';
import Footer from './layout/Footer';
import { hasAuthParams, useAuth } from 'react-oidc-context';
import { Routing } from './Routing';
import { useStore } from './hooks/use-store';
import { userStore } from './stores/user-store';
import { useEffect, useState } from 'react';

export const Layout = () => {
  const auth = useAuth();
  const [hasTriedSignin, setHasTriedSignin] = useState(false);
  
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setUserStoreUser] = useStore(userStore);
  
  useEffect(() => {
    if (!hasAuthParams() && auth.user != null &&
        !auth.isAuthenticated && !auth.activeNavigator && !auth.isLoading &&
        !hasTriedSignin
    ) {
        setHasTriedSignin(true);
        (async () => {
          try {
            const newUser = await auth.signinSilent();
            if (!newUser) {
              await auth.signoutRedirect();
            }
          } catch (err) {
            console.error(err);
            await auth.signoutRedirect();
          }
        })();
    }
}, [auth, hasTriedSignin, auth.user]);

  useEffect(() => {
    setUserStoreUser(!auth.user ? undefined : auth.user);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth.user]);

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
        <Routing auth={auth} />
      </div>
      <Footer />
    </>
  );
};

export default Layout;
