import { assertExports } from '../util/assertExports';

describe('StringTypeNode :: ExportTypeDefinition', () => {
  test('None', () => {
    assertExports(`export type T = string;`, {
      base: 'string',
    });
  });

  test('Min', () => {
    assertExports(`export type T = string({3,});`, {
      signed: symName => `string & {[${symName}]: { type: "string"; min: 3 }}`,
      base: 'string',
    });
  });

  test('Max', () => {
    assertExports(`export type T = string({, 3});`, {
      signed: symName => `string & {[${symName}]: { type: "string"; max: 3 }}`,
      base: 'string',
    });
  });

  test('Min, Max', () => {
    assertExports(`export type T = string({3, 3});`, {
      signed: symName => `string & {[${symName}]: { type: "string"; min: 3; max: 3 }}`,
      base: 'string',
    });
  });
});
