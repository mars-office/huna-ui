import { useEffect } from "react";
import { useAuth } from "react-oidc-context";
import signalrService from "../services/signalr.service";

export const useSignalrConnection = () => {
  const auth = useAuth();
  useEffect(() => {
    if (auth.isLoading) {
      return;
    }
    (async () => {
      if (auth.isAuthenticated && auth.user) {
        console.log('Connecting to SignalR...');
        await signalrService.connect();
      } else {
        console.log('Disconnecting from SignalR...');
        await signalrService.disconnect();
      }
    })();
  }, [auth]);
}

export default useSignalrConnection;