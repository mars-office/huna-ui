import Footer from "../layout/Footer";
import Header from "../layout/Header";
import { Outlet } from "react-router-dom";

const Root = () => {
  return (
    <>
      <Header />
      <div
        style={{
          display: "flex",
          flex: "1 1 auto",
          minHeight: "0",
          overflow: "auto",
        }}
      >
        <Outlet />
      </div>
      <Footer />
    </>
  );
};

export default Root;
