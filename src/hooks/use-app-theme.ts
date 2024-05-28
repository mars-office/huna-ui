import { useCallback, useEffect, useState } from "react";
import { AppTheme } from "../models/app-theme";
import { Theme, teamsDarkTheme, teamsLightTheme } from "@fluentui/react-components";
import { usePrefersDarkMode } from "./use-prefers-dark-mode";

export const useAppTheme = () => {
  const [appTheme, setAppTheme] = useState<AppTheme>(localStorage.getItem('appTheme') ? (localStorage.getItem('appTheme') as AppTheme) : 'auto');
  const [fluentTheme, setFluentTheme] = useState<Theme>(teamsLightTheme);
  const prefersDarkMode = usePrefersDarkMode();

  useEffect(() => {
    if (appTheme === 'auto') {
      setFluentTheme(prefersDarkMode ? teamsDarkTheme : teamsLightTheme);
      return;
    }
    setFluentTheme(appTheme === 'light' ? teamsLightTheme : teamsDarkTheme);
  }, [appTheme, prefersDarkMode]);

  const themeSwitched = useCallback((theme: AppTheme) => {
    setAppTheme(theme);
    localStorage.setItem('appTheme', theme);
  }, [setAppTheme]);

  return {fluentTheme, themeSwitched, appTheme};
}

export default useAppTheme;