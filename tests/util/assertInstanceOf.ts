export function assertInstanceOf<T>(x: unknown, Constructor: { new (...args: any[]): T }): asserts x is T {
  expect(x).toBeInstanceOf(Constructor);
}
