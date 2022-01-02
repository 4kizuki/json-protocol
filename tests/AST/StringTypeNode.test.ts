import { StringTypeNode } from '../../src/types/AST/Node/TypeLiteralNode';
import { assertType } from '../util/assertType';
import { createDummyLocation } from '../util/createDummyLocation';

const location = createDummyLocation();

describe('StringTypeNode :: ExportTypeDefinition', (): void => {
  test('None', (): void => {
    const symName = 'sym';

    assertType(
      new StringTypeNode({
        type: 'string_type',
        payload: {
          min: null,
          max: null,
        },
        location,
      }).exportTypeDefinition(symName),
      `string`,
    );
  });
  test('Min', (): void => {
    const symName = 'sym';

    assertType(
      new StringTypeNode({
        type: 'string_type',
        payload: {
          min: { type: 'unsigned_integer', value: '3', location },
          max: null,
        },
        location,
      }).exportTypeDefinition(symName),
      `string & {[${symName}]: { type: "string"; min: 3 }}`,
    );
  });
  test('Max', (): void => {
    const symName = 'sym';

    assertType(
      new StringTypeNode({
        type: 'string_type',
        payload: {
          min: null,
          max: { type: 'unsigned_integer', value: '3', location },
        },
        location,
      }).exportTypeDefinition(symName),
      `string & {[${symName}]: { type: "string"; max: 3 }}`,
    );
  });
  test('Min, Max', (): void => {
    const symName = 'sym';

    assertType(
      new StringTypeNode({
        type: 'string_type',
        payload: {
          min: { type: 'unsigned_integer', value: '3', location },
          max: { type: 'unsigned_integer', value: '4', location },
        },
        location,
      }).exportTypeDefinition(symName),
      `string & {[${symName}]: { type: "string"; min: 3; max: 4 }}`,
    );
  });
});
