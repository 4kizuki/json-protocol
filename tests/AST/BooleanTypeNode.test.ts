import { assertType } from '../util/assertType';
import { BooleanTypeNode } from '../../src/types/AST/Node/TypeLiteralNode';
import { createDummyLocation } from '../util/createDummyLocation';

const location = createDummyLocation();

describe('BooleanTypeNode :: ExportTypeDefinition', (): void => {
  test('Default', (): void => {
    const symName = 'sym';

    assertType(
      new BooleanTypeNode({
        type: 'boolean_type',
        payload: null,
        location,
      }).exportTypeDefinition(symName),
      `boolean`,
    );
  });
});
