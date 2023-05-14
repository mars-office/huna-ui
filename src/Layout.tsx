import Header from "./layout/Header";
import Footer from "./layout/Footer";
import { useAuth } from "oidc-react";
import { Routing } from "./Routing";

export const Layout = () => {
  const auth = useAuth();

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
