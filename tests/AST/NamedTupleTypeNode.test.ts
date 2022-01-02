import { assertType } from '../util/assertType';
import { NamedTupleTypeNode } from '../../src/types/AST/Node/TypeLiteralNode';
import { createDummyLocation } from '../util/createDummyLocation';

const location = createDummyLocation();

describe('NamedTupleTypeNode :: ExportTypeDefinition', (): void => {
  test('Default', (): void => {
    const symName = 'sym';

    assertType(
      new NamedTupleTypeNode({
        type: 'named_tuple_type',
        payload: {
          elements: [
            {
              type: {
                type: 'string_type',
                payload: { min: null, max: { type: 'unsigned_integer', location, value: '3' } },
                location,
              },
              identifier: { type: 'identifier', payload: { name: 'some' }, location },
              optional: true,
            },
            {
              type: {
                type: 'string_type',
                payload: { max: null, min: { type: 'unsigned_integer', location, value: '3' } },
                location,
              },
              identifier: { type: 'identifier', payload: { name: 'min3' }, location },
              optional: false,
            },
          ],
        },
        location,
      }).exportTypeDefinition(symName),
      `[some?: string & { [${symName}]: {type: "string", max: 3} }, min3: string & { [${symName}]: {type: "string", min: 3} }] &  { [${symName}]: { type: "named-tuple" } }`,
    );
  });
});
