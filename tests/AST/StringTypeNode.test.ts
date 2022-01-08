import { assertExports } from '../util/assertExports';
import { StringTypeNode } from '../../src/types/AST/Node/TypeLiteralNode/TypeLiteralNode';
import { assertInstanceOf } from '../util/assertInstanceOf';
import { ValidationError } from '../../src/errors/ValidationError';
import { instantiateFunction } from '../util/instantiateFunction';

describe('StringTypeNode :: ExportTypeDefinition', () => {
  test('None', () => {
    const t = assertExports(`export type T = string;`, {
      base: 'string',
    });

    assertInstanceOf(t, StringTypeNode);
    const validator = instantiateFunction(t.exportValidator('jsonProto', 'var'));
    expect(validator('123')).toBe('123');
  });

  test('Min', () => {
    const t = assertExports(`export type T = string({3,});`, {
      signed: symName => `string & {[${symName}]: { type: "string"; min: 3 }}`,
      base: 'string',
    });

    assertInstanceOf(t, StringTypeNode);
    const validator = instantiateFunction(t.exportValidator('jsonProto', 'var'));
    expect(() => validator('12')).toThrowError(ValidationError);
    expect(validator('123')).toBe('123');
    expect(validator('1234')).toBe('1234');
  });

  test('Max', () => {
    const t = assertExports(`export type T = string({, 3});`, {
      signed: symName => `string & {[${symName}]: { type: "string"; max: 3 }}`,
      base: 'string',
    });

    assertInstanceOf(t, StringTypeNode);
    const validator = instantiateFunction(t.exportValidator('jsonProto', 'var'));
    expect(validator('12')).toBe('12');
    expect(validator('123')).toBe('123');
    expect(() => validator('1234')).toThrowError(ValidationError);
  });

  test('Min, Max', () => {
    const t = assertExports(`export type T = string({3, 3});`, {
      signed: symName => `string & {[${symName}]: { type: "string"; min: 3; max: 3 }}`,
      base: 'string',
    });

    assertInstanceOf(t, StringTypeNode);
    const validator = instantiateFunction(t.exportValidator('jsonProto', 'var'));
    expect(() => validator('12')).toThrowError(ValidationError);
    expect(validator('123')).toBe('123');
    expect(() => validator('1234')).toThrowError(ValidationError);
  });
});
