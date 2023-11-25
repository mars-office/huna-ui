import Header from "./layout/Header";
import Footer from "./layout/Footer";
import { useAuth } from "oidc-react";
import { Routing } from "./Routing";
import { useEffect } from "react";
import enableAuthInterceptor from "./services/auth.interceptor";

export const Layout = () => {
  const auth = useAuth();

  useEffect(() => {
    enableAuthInterceptor(auth.userData?.access_token);
  }, [auth.userData]);

  return (
    <>
      <Header auth={auth} />
      <div
        style={{
          flex: "1 1 auto",
          minHeight: "0",
          overflow: "auto",
          padding: "1rem",
        }}
      >
        <Routing auth={auth} />
      </div>
      <Footer />
    </>
  );
};

export default Layout;
