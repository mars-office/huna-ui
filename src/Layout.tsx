import Header from './layout/Header';
import Footer from './layout/Footer';
import { useAuth,  } from 'react-oidc-context';
import { Routing } from './Routing';
import { useStore } from './hooks/use-store';
import { userStore } from './stores/user-store';
import { useEffect } from 'react';

export const Layout = () => {
  const auth = useAuth();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setUserStoreUser] = useStore(userStore);

  useEffect(() => {
    (async () => {
      
     // const x = await auth.userManager.signinSilent();
    //  console.log(x);
    })();
    
  }, []);

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
