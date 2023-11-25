import { Route, Routes } from "react-router-dom";
import Home from "./routes/Home";
import Login from "./routes/Login";
import Settings from "./routes/Settings";
import NotFound from "./routes/NotFound";
import ProtectedRoute from "./routes/ProtectedRoute";
import { AuthContextProps } from "react-oidc-context";

export interface RoutingProps {
  auth: AuthContextProps;
}

export const Routing = (props: RoutingProps) => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/settings"
          element={
            <ProtectedRoute auth={props.auth}>
              <Settings />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};
