import { assertExports } from '../util/assertExports';

describe('DateStringTypeNode :: ExportTypeDefinition', () => {
  test('Default', () => {
    assertExports('export type T = DateString;', {
      base: 'Date',
      json: 'string',
    });
  });
});
