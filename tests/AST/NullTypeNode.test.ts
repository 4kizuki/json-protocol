import { assertExports } from '../util/assertExports';

describe('NullTypeNode :: ExportTypeDefinition', () => {
  test('Default', () => {
    assertExports(`export type T = null;`, {
      base: 'null',
    });
  });
});
