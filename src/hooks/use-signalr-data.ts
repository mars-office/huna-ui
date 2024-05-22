import { DependencyList, useEffect } from "react";
import signalrService from "../services/signalr.service";

export const useSignalrData = <T>(eventType: string, cb: (data: T) => Promise<void>, errorHandler?: ((e: any) => void) | undefined, deps?: DependencyList | undefined) => {
  useEffect(() => {
    const subscription = signalrService.listen<T>(eventType, cb, errorHandler);
    return () => {
      subscription.unsubscribe();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
};