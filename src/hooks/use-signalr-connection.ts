import { useEffect } from 'react';
import { useAuth } from 'react-oidc-context';
import signalrService from '../services/signalr.service';
import { HubConnectionState } from '@microsoft/signalr';

export const useSignalrConnection = () => {
  const auth = useAuth();
  useEffect(() => {
    if (auth.isLoading) {
      return;
    }
    (async () => {
      if (auth.isAuthenticated && auth.user) {
        console.log('Connecting to SignalR...');
        if (
          signalrService.connectionState === HubConnectionState.Disconnected ||
          signalrService.connectionState === HubConnectionState.Disconnecting
        ) {
          await signalrService.connect();
        }
      } else {
        console.log('Disconnecting from SignalR...');
        if (
          signalrService.connectionState === HubConnectionState.Connected ||
          signalrService.connectionState === HubConnectionState.Connecting
        ) {
          await signalrService.disconnect();
        }
      }
    })();
  }, [auth]);
};

export default useSignalrConnection;
