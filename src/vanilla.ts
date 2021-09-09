import { useLayoutEffect, useReducer } from 'react';
import { createProxy } from 'proxy-compare';

const listeners = new WeakMap();
const affected = new WeakMap();

export const useAxion = (state: any, id) => {
  const fn = useReducer((c) => c + 1, [])[1];

  useLayoutEffect(() => {
    if (listeners.has(state)) {
      listeners.get(state).push(fn);
    } else {
      listeners.set(state, [fn]);
    }
  }, []);

  return new Proxy(state, {
    set(target, prop, value) {
      listeners.get(state).forEach((l) => l());

      target[prop] = value;
      return true;
    },
  });
};

export const proxy = <T extends object>(initialObject: T = {} as T): any => {
  return createProxy(initialObject, affected);
};
