import ReactDOM from "react-dom/client";
import { FluentProvider, teamsDarkTheme } from "@fluentui/react-components";
import App from "./App";
import { BrowserRouter } from "react-router-dom";

import './i18n';

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <FluentProvider
    style={{
      width: "100%",
      height: "100%",
      display: "flex",
      flexDirection: "column",
    }}
    theme={teamsDarkTheme}
  >
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </FluentProvider>
);
