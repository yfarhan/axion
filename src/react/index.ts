import { useMemo, useRef, useReducer } from 'react';

export const useSnapshot = <T extends object>(proxyObject: T) => {
  const forceUpdate = useReducer((c) => c + 1, 0)[1];

  const p = useRef(
    new Proxy(proxyObject, {
      set(target: any, prop, value) {
        target[prop] = value;
        forceUpdate();
        return true;
      },
      get(target, prop, receiver) {
        return target[prop];
      },
    })
  );

  return p.current;
};
