import { assertType } from '../util/assertType';
import { FloatLiteralTypeNode } from '../../src/types/AST/Node/TypeLiteralNode';
import { createDummyLocation } from '../util/createDummyLocation';

const location = createDummyLocation();

describe('FloatLiteralTypeNode :: ExportTypeDefinition', (): void => {
  test('Default', (): void => {
    const symName = 'sym';

    assertType(
      new FloatLiteralTypeNode({
        type: 'float_literal_type',
        payload: { value: { type: 'float', location, value: '-33.491092' } },
        location,
      }).exportTypeDefinition(symName),
      `-33.491092`,
    );
  });
});
