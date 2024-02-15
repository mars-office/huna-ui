import { DependencyList, useEffect } from "react";
import signalrService from "../services/signalr.service";

export const useSignalrData = (cb: (data: any) => Promise<void>, deps?: DependencyList | undefined) => {
  useEffect(() => {
    const subscription = signalrService.dataReceived.subscribe({
      onNext: d => {
        (async () => {
          await cb(d);
        })();
      }
    });
    return () => {
      subscription.unsubscribe();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
};