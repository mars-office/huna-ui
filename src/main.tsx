import ReactDOM from "react-dom/client";
import { FluentProvider, teamsDarkTheme } from "@fluentui/react-components";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
import { AuthProvider } from "oidc-react";
import { authConfig } from "./auth";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <AuthProvider {...authConfig}>
    <FluentProvider
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
      theme={teamsDarkTheme}
    >
      <RouterProvider router={router} />
    </FluentProvider>
  </AuthProvider>
);
