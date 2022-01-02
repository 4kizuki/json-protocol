import { assertType } from '../util/assertType';
import { DateStringTypeNode } from '../../src/types/AST/Node/TypeLiteralNode';
import { createDummyLocation } from '../util/createDummyLocation';

const location = createDummyLocation();

describe('DateStringTypeNode :: ExportTypeDefinition', (): void => {
  test('Default', (): void => {
    const symName = 'sym';

    assertType(
      new DateStringTypeNode({
        type: 'date_string_type',
        payload: null,
        location,
      }).exportTypeDefinition(symName),
      `string & { [${symName}]: { type: "date-string" } }`,
    );
  });
});
