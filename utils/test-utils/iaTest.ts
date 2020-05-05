export function mockNavigationProps(props: Object = {}): Object {
  return {
    navigation: {
      // when use in a unit test jest will be defined
      navigate: jest.fn(),
    },
    ...props,
  };
}

export function mockRouteParamsProps(params: Object, props: Object = {}): Object {
  return {
    route: {
      params,
    },
    ...props,
  };
}
