import { assertExports } from '../util/assertExports';

describe('FloatTypeNode :: ExportTypeDefinition', () => {
  test('None', () => {
    assertExports(`export type T = float;`, {
      signed: symName => `number & { [${symName}]: { type: "float" } }`,
      base: 'number',
    });
  });

  test('Left', () => {
    assertExports(`export type T = float([?-3, ]);`, {
      signed: symName => `number & { [${symName}]: { type: "float", left: "open| -3" } }`,
      base: 'number',
    });
  });

  test('Right', () => {
    assertExports(`export type T = float([, 3.2294]);`, {
      signed: symName => `number & { [${symName}]: { type: "float", right: "closed| 3.2294" } }`,
      base: 'number',
    });
  });

  test('Left, Right', () => {
    assertExports(`export type T = float([-3.3392, 3?]);`, {
      signed: symName => `number & {[${symName}]: { type: "float", left: "closed| -3.3392", right: "open| 3" }`,
      base: 'number',
    });
  });
});
