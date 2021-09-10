import { useLayoutEffect, useReducer } from 'react';
import { createProxy } from 'proxy-compare';

const listeners = new WeakMap();
const affected = new WeakMap();

export const useAxion = <T extends object>(state: T) => {
  const fn = useReducer((c) => c + 1, [])[1];

  useLayoutEffect(() => {
    if (listeners.has(state)) {
      listeners.get(state).push(fn);
    } else {
      listeners.set(state, [fn]);
    }
  }, []);

  return new Proxy(state, {
    set(target: any, prop: string, value) {
      listeners.get(state).forEach((l: Function) => l());

      target[prop] = value;
      return true;
    },
  });
};

export const proxy = <T extends object>(initialObject: T = {} as T): T => {
  return createProxy(initialObject, affected);
};
