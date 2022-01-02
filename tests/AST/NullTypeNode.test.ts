import { assertType } from '../util/assertType';
import { BooleanTypeNode, NullTypeNode } from '../../src/types/AST/Node/TypeLiteralNode';
import { createDummyLocation } from '../util/createDummyLocation';

const location = createDummyLocation();

describe('NullTypeNode :: ExportTypeDefinition', (): void => {
  test('Default', (): void => {
    const symName = 'sym';

    assertType(
      new NullTypeNode({
        type: 'null_type',
        payload: null,
        location,
      }).exportTypeDefinition(symName),
      `null`,
    );
  });
});
