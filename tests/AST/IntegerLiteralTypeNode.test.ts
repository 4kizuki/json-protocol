import { assertType } from '../util/assertType';
import { IntegerLiteralTypeNode } from '../../src/types/AST/Node/TypeLiteralNode';
import { createDummyLocation } from '../util/createDummyLocation';

const location = createDummyLocation();

describe('IntegerLiteralTypeNode :: ExportTypeDefinition', (): void => {
  test('Default', (): void => {
    const symName = 'sym';

    assertType(
      new IntegerLiteralTypeNode({
        type: 'integer_literal_type',
        payload: { value: { type: 'signed_integer', location, value: '303030' } },
        location,
      }).exportTypeDefinition(symName),
      `303030`,
    );
  });
});
