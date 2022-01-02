import { assertType } from '../util/assertType';
import { FloatLiteralTypeNode, StringLiteralTypeNode } from '../../src/types/AST/Node/TypeLiteralNode';
import { createDummyLocation } from '../util/createDummyLocation';

const location = createDummyLocation();

describe('StringLiteralTypeNode :: ExportTypeDefinition', (): void => {
  test('Default', (): void => {
    const symName = 'sym';

    assertType(
      new StringLiteralTypeNode({
        type: 'string_literal_type',
        payload: { value: { type: 'string', location, value: '-33.491092' } },
        location,
      }).exportTypeDefinition(symName),
      `"-33.491092"`,
    );
  });
});
