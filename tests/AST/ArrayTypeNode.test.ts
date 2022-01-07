import { assertExports } from '../util/assertExports';

describe('ArrayTypeNode :: ExportTypeDefinition', () => {
  test('None', () => {
    assertExports(`export type T = string({3,})[];`, {
      signed: symName => `(string & { [${symName}]: {type: "string", min: 3} })[]`,
      base: '(string)[]',
    });
  });

  test('Min', () => {
    assertExports(`export type T = string({3,})[3,];`, {
      signed: symName =>
        `(string & { [${symName}]: {type: "string", min: 3} })[] & {[${symName}]: {type: "array", min: 3}}`,
      base: '(string)[]',
    });
  });

  test('Max', () => {
    assertExports(`export type T = string({3,})[,3];`, {
      signed: symName =>
        `(string & { [${symName}]: {type: "string", min: 3} })[] & {[${symName}]: {type: "array", max: 3}}`,
      base: '(string)[]',
    });
  });

  test('Min, Max', () => {
    assertExports(`export type T = string({3,})[1,3];`, {
      signed: symName =>
        `(string & { [${symName}]: {type: "string", min: 3} })[] & {[${symName}]: {type: "array", min: 1, max: 3}}`,
      base: '(string)[]',
    });
  });

  test('None, Reference', () => {
    const refType = 'ReferencedType';
    assertExports(`export type T = ${refType}[]; type ${refType} = {};`, {
      signed: `${refType}[]`,
      base: `(${refType}.BaseType)[]`,
      json: `(${refType}.JsonType)[]`,
    });
  });
});
