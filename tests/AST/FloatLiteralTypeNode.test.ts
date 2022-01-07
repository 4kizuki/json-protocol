import { assertExports } from '../util/assertExports';

describe('FloatLiteralTypeNode :: ExportTypeDefinition', () => {
  test('Default', () => {
    assertExports(`export type T = -33.491092;`, {
      base: '-33.491092',
    });
  });
});
