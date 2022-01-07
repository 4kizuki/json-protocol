import { assertExports } from '../util/assertExports';

describe('BooleanTypeNode :: ExportTypeDefinition', () => {
  test('Default', () => {
    assertExports('export type T = boolean;', {
      base: 'boolean',
    });
  });
});
