import { AuthProvider } from 'react-oidc-context';
import PwaUpdate from './layout/PwaUpdate';
import { FluentProvider } from '@fluentui/react-components';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import useAppTheme from './hooks/use-app-theme';
import authConfig from './config/auth.config';

export const Root = () => {
  const { themeSwitched, fluentTheme, appTheme } = useAppTheme();

  return (
    <>
      <FluentProvider
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
        theme={fluentTheme}
      >
        <PwaUpdate />
        <BrowserRouter>
          <AuthProvider {...authConfig}>
            <App appTheme={appTheme} onSwitchTheme={themeSwitched} />
          </AuthProvider>
        </BrowserRouter>
      </FluentProvider>
    </>
  );
};
export default Root;
