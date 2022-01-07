import { assertExports } from '../util/assertExports';

describe('BooleanLiteralTypeNode :: ExportTypeDefinition', () => {
  test('True', () => {
    assertExports(`export type T = true;`, {
      base: 'true',
    });
  });

  test('False', () => {
    assertExports(`export type T = false;`, {
      base: 'false',
    });
  });
});
