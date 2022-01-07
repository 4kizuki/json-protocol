import { assertExports } from '../util/assertExports';

describe('IntegerLiteralTypeNode :: ExportTypeDefinition', () => {
  test('Default', () => {
    assertExports(`export type T = 303030;`, {
      base: '303030',
    });
  });
});
