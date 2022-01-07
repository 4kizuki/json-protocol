import { assertExports } from '../util/assertExports';

describe('UnionTypeNode :: ExportTypeDefinition', () => {
  test('Default', () => {
    assertExports(`export type T = string({, 3}) | string({3, });`, {
      signed: symName =>
        `((string & { [${symName}]: {type: "string", max: 3} })|(string & {[${symName}]: {type: "string", min: 3} }))`,
      base: 'string | string',
    });
  });
});
