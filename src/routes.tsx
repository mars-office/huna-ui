import { createBrowserRouter } from "react-router-dom";
import Root from "./routes/Root";
import RouterError from "./routes/RouterError";
import Home from "./routes/Home";
import Login from "./routes/Login";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <RouterError />,
    children: [
      {
        path: '',
        element: <Home />
      },
      {
        path: 'login',
        element: <Login />
      }
    ]
  },
]);
