import { ReactTestInstance } from "react-test-renderer";

export function findByTestID(
  root: ReactTestInstance,
  testID: string
): ReactTestInstance {
  return root.findByProps({ testID });
}

export function mockNavigationProps(props = {}) {
  return {
    navigation: {
      // when use in a unit test jest will be defined
      navigate: jest.fn(),
    },
    ...props,
  };
}
