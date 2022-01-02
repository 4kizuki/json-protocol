import { assertType } from '../util/assertType';
import { createDummyLocation } from '../util/createDummyLocation';
import { UnionTypeNode } from '../../src/types/AST/Node/TypeLiteralNode';

const location = createDummyLocation();

describe('UnionTypeNode :: ExportTypeDefinition', (): void => {
  test('Default', (): void => {
    const symName = 'sym';

    assertType(
      new UnionTypeNode({
        type: 'union_type',
        payload: {
          types: [
            {
              type: 'string_type',
              payload: { min: null, max: { type: 'unsigned_integer', location, value: '3' } },
              location,
            },
            {
              type: 'string_type',
              payload: { max: null, min: { type: 'unsigned_integer', location, value: '3' } },
              location,
            },
          ],
        },
        location,
      }).exportTypeDefinition(symName),
      `((string & { [${symName}]: {type: "string", max: 3} })|(string & {[${symName}]: {type: "string", min: 3} }))`,
    );
  });
});
