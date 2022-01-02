import { assertType } from '../util/assertType';
import { ArrayTypeNode } from '../../src/types/AST/Node/TypeLiteralNode';
import { createDummyLocation } from '../util/createDummyLocation';

const location = createDummyLocation();

describe('ArrayTypeNode :: ExportTypeDefinition', (): void => {
  test('None', (): void => {
    const symName = 'sym';
    assertType(
      new ArrayTypeNode({
        type: 'array_type',
        payload: {
          type: {
            type: 'string_type',
            location,
            payload: {
              min: { type: 'unsigned_integer', location, value: '3' },
              max: null,
            },
          },
          min: null,
          max: null,
        },
        location,
      }).exportTypeDefinition(symName),
      `(string & { [${symName}]: {type: "string", min: 3} })[]`,
    );
  });

  test('Min', (): void => {
    const symName = 'sym';

    assertType(
      new ArrayTypeNode({
        type: 'array_type',
        payload: {
          type: {
            type: 'string_type',
            location,
            payload: {
              min: { type: 'unsigned_integer', location, value: '3' },
              max: null,
            },
          },
          min: { type: 'unsigned_integer', location, value: '3' },
          max: null,
        },
        location,
      }).exportTypeDefinition(symName),
      `(string & { [${symName}]: {type: "string", min: 3} })[] & {[${symName}]: {type: "array", min: 3}}`,
    );
  });

  test('Max', (): void => {
    const symName = 'sym';

    assertType(
      new ArrayTypeNode({
        type: 'array_type',
        payload: {
          type: {
            type: 'string_type',
            location,
            payload: {
              min: { type: 'unsigned_integer', location, value: '3' },
              max: null,
            },
          },
          min: null,
          max: { type: 'unsigned_integer', location, value: '3' },
        },
        location,
      }).exportTypeDefinition(symName),
      `(string & { [${symName}]: {type: "string", min: 3} })[] & {[${symName}]: {type: "array", max: 3}}`,
    );
  });

  test('Min, Max', (): void => {
    const symName = 'sym';

    assertType(
      new ArrayTypeNode({
        type: 'array_type',
        payload: {
          type: {
            type: 'string_type',
            location,
            payload: {
              min: { type: 'unsigned_integer', location, value: '3' },
              max: null,
            },
          },
          min: { type: 'unsigned_integer', location, value: '1' },
          max: { type: 'unsigned_integer', location, value: '3' },
        },
        location,
      }).exportTypeDefinition(symName),
      `(string & { [${symName}]: {type: "string", min: 3} })[] & {[${symName}]: {type: "array", min: 1, max: 3}}`,
    );
  });
});
