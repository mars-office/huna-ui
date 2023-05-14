import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Root from "./routes/Root";
import RouterError from "./routes/RouterError";
import Home from "./routes/Home";
import Login from "./routes/Login";
import { useMemo } from "react";
import { useAuth } from "oidc-react";
import ProtectedRoute from "./routes/ProtectedRoute";
import Settings from "./routes/Settings";

export const Routing = () => {
  const auth = useAuth();

  const router = useMemo(() => {
    return createBrowserRouter([
      {
        path: "/",
        element: <Root />,
        errorElement: <RouterError />,
        children: [
          {
            path: "",
            element: <Home />,
          },
          {
            path: "login",
            element: <Login />,
          },
          {
            path: "settings",
            element: (
              <ProtectedRoute auth={auth}>
                <Settings />
              </ProtectedRoute>
            ),
          },
        ],
      },
    ]);
  }, [auth]);

  return <RouterProvider router={router} />;
};

export default Routing;
