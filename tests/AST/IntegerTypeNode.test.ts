import { assertExports } from '../util/assertExports';

describe('IntegerTypeNode :: ExportTypeDefinition', () => {
  test('None', () => {
    assertExports(`export type T = integer;`, {
      signed: symName => `number & {[${symName}]: { type: "integer" }`,
      base: 'number',
    });
  });

  test('Min', () => {
    assertExports(`export type T = integer([-3,]);`, {
      signed: symName => `number & {[${symName}]: { type: "integer", min: -3 }`,
      base: 'number',
    });
  });

  test('Max', () => {
    assertExports(`export type T = integer([, 3245]);`, {
      signed: symName => `number & {[${symName}]: { type: "integer", max: 3245 }`,
      base: 'number',
    });
  });

  test('Min, Max', () => {
    assertExports(`export type T = integer([-3, 3245]);`, {
      signed: symName => `number & {[${symName}]: { type: "integer", min: -3, max: 3245 }`,
      base: 'number',
    });
  });
});
