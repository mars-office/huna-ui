import { useCallback, useEffect, useState } from 'react';
import { BehaviourSubject } from '../helpers/behaviour-subject';

export const useStore = <T>(store: BehaviourSubject<T>): [T, (nv: T) => void] => {
  const [storeState, _setStoreState] = useState<T>(store.value);

  useEffect(() => {
    const sub = store.subscribe({
      onNext: (v) => {
        _setStoreState(v);
      },
      onError: (e) => {
        throw e;
      },
      onComplete: () => {
        sub.unsubscribe();
      },
    });
    return () => {
      sub.unsubscribe();
    };
  }, [store]);

  const setStoreState = useCallback(
    (newVal: T) => {
      store.next(newVal);
    },
    [store],
  );

  return [storeState, setStoreState];
};
