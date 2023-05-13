import Footer from "../layout/Footer";
import Header from "../layout/Header";
import { Outlet } from "react-router-dom";
import { useAuth } from 'oidc-react';

const Root = () => {
  const auth = useAuth();
    
  return (
    <>
      <Header auth={auth} />
      <div
        style={{
          flex: "1 1 auto",
          minHeight: "0",
          overflow: "auto",
          padding: '1rem'
        }}
      >
        <Outlet context={{
          auth: auth
        }} />
      </div>
      <Footer />
    </>
  );
};

export default Root;
