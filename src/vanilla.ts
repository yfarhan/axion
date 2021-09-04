import { getUntracked, markToTrack } from 'proxy-compare';

const isSupportedObject = (x: unknown): x is object =>
  typeof x === 'object' &&
  x !== null &&
  (Array.isArray(x) || !(x as any)[Symbol.iterator]) &&
  !(x instanceof WeakMap) &&
  !(x instanceof WeakSet) &&
  !(x instanceof Error) &&
  !(x instanceof Number) &&
  !(x instanceof Date) &&
  !(x instanceof String) &&
  !(x instanceof RegExp) &&
  !(x instanceof ArrayBuffer);

type ProxyObject = object;
const proxyCache = new WeakMap<object, ProxyObject>();

export const proxy = <T extends object>(initialObject: T = {} as T): T => {
  if (!isSupportedObject(initialObject)) {
    throw new Error('unsupported object type');
  }

  const found = proxyCache.get(initialObject) as T | undefined;
  if (found) {
    return found;
  }

  const baseObject = Array.isArray(initialObject)
    ? []
    : Object.create(Object.getPrototypeOf(initialObject));

  const proxyObject = new Proxy(baseObject, {
    get(target, prop, receiver) {
      return target[prop];
    },

    set(target, prop, value) {
      const prevValue = target[prop];
      if (Object.is(prevValue, value)) {
        return true;
      }

      target[prop] = value;
      return true;
    },
  });

  proxyCache.set(initialObject, proxyObject);
  Reflect.ownKeys(initialObject).forEach((key) => {
    const desc = Object.getOwnPropertyDescriptor(initialObject, key) as PropertyDescriptor;
    if (desc.get || desc.set) {
      Object.defineProperty(baseObject, key, desc);
    } else {
      proxyObject[key] = (initialObject as any)[key];
    }
  });

  console.group('proxyObject');
  console.log(proxyObject);
  console.log(proxyCache);
  console.groupEnd();

  return proxyObject;
};
