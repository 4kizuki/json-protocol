import { assertType } from '../util/assertType';
import { BooleanLiteralTypeNode, FloatLiteralTypeNode } from '../../src/types/AST/Node/TypeLiteralNode';
import { createDummyLocation } from '../util/createDummyLocation';

const location = createDummyLocation();

describe('BooleanLiteralTypeNode :: ExportTypeDefinition', (): void => {
  test('True', (): void => {
    const symName = 'sym';

    assertType(
      new BooleanLiteralTypeNode({
        type: 'boolean_literal_type',
        payload: { value: { type: 'boolean', location, value: true } },
        location,
      }).exportTypeDefinition(symName),
      `true`,
    );
  });

  test('False', (): void => {
    const symName = 'sym';

    assertType(
      new BooleanLiteralTypeNode({
        type: 'boolean_literal_type',
        payload: { value: { type: 'boolean', location, value: false } },
        location,
      }).exportTypeDefinition(symName),
      `false`,
    );
  });
});
