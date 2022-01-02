import { assertType } from '../util/assertType';
import { IntegerTypeNode } from '../../src/types/AST/Node/TypeLiteralNode';
import { createDummyLocation } from '../util/createDummyLocation';

const location = createDummyLocation();

describe('IntegerTypeNode :: ExportTypeDefinition', (): void => {
  test('None', (): void => {
    const symName = 'sym';

    assertType(
      new IntegerTypeNode({
        type: 'integer_type',
        payload: {
          min: null,
          max: null,
        },
        location,
      }).exportTypeDefinition(symName),
      `number & {[${symName}]: { type: "integer" }`,
    );
  });

  test('Min', (): void => {
    const symName = 'sym';

    assertType(
      new IntegerTypeNode({
        type: 'integer_type',
        payload: {
          min: { type: 'signed_integer', value: '-3', location },
          max: null,
        },
        location,
      }).exportTypeDefinition(symName),
      `number & {[${symName}]: { type: "integer", min: -3 }`,
    );
  });

  test('Max', (): void => {
    const symName = 'sym';

    assertType(
      new IntegerTypeNode({
        type: 'integer_type',
        payload: {
          min: null,
          max: { type: 'signed_integer', value: '3245', location },
        },
        location,
      }).exportTypeDefinition(symName),
      `number & {[${symName}]: { type: "integer", max: 3245 }`,
    );
  });

  test('Min, Max', (): void => {
    const symName = 'sym';

    assertType(
      new IntegerTypeNode({
        type: 'integer_type',
        payload: {
          min: { type: 'signed_integer', value: '-3', location },
          max: { type: 'signed_integer', value: '3245', location },
        },
        location,
      }).exportTypeDefinition(symName),
      `number & {[${symName}]: { type: "integer", min: -3, max: 3245 }`,
    );
  });
});
