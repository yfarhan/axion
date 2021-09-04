type Options = {
  sync?: boolean;
};

export const useSnapshot = <T extends object>(proxyObject: T, options?: Options) => {
  console.log('---> useSnapshot', proxyObject);
  console.log(proxyObject);

  return proxyObject;
};
