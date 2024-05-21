import { useRegisterSW } from 'virtual:pwa-register/react';
import UpdateDialog from './layout/UpdateDialog';
import { useCallback } from 'react';

export interface PwaRootProps {
  children: JSX.Element;
}

let checkForUpdateInterval: any;

const updateCheckInterval = 60 * 60 * 1000;

export const PwaRoot = (props: PwaRootProps) => {
  console.log('Rendering PWA root...');
  const { needRefresh, updateServiceWorker } = useRegisterSW({
    onRegisteredSW: (url, r) => {
      console.log('Trying to register SW...');
      if (!r) {
        console.log('No SW registration.');
        return;
      }
      if (!checkForUpdateInterval) {
        console.log('SW registered. Starting periodic check.', url);
        checkForUpdateInterval = setInterval(() => {
          console.log('Checking for update...');
          r.update();
        }, updateCheckInterval);
      }
    },
    onRegisterError: (error) => {
      console.error('Register SW failed', error);
    },
  });

  const installUpdate = useCallback(async () => {
    needRefresh[1](() => false);
    await updateServiceWorker();
  }, []);

  const rejectUpdate = useCallback(() => {
    needRefresh[1](() => false);
  }, []);

  return (
    <>
      <UpdateDialog isVisible={needRefresh[0]} onInstall={installUpdate} onReject={rejectUpdate} />
      {props.children}
    </>
  );
};

export default PwaRoot;
