import ReactDOM from "react-dom/client";
import { FluentProvider, teamsDarkTheme } from "@fluentui/react-components";
import { AuthProvider } from "oidc-react";
import { authConfig } from "./auth";
import Routing from "./Routing";

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
      <Routing />
    </FluentProvider>
  </AuthProvider>
);
