import { assertExports } from '../util/assertExports';

describe('StringLiteralTypeNode :: ExportTypeDefinition', () => {
  test('Default', () => {
    assertExports(`export type T = "33.4";`, {
      base: '"33.4"',
    });
  });
});
