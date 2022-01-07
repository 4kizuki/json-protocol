import { assertExports } from '../util/assertExports';

describe('NamedTupleTypeNode :: ExportTypeDefinition', () => {
  test('Default', () => {
    assertExports(`export type T = [some?: string({, 3}), min3: string({3, })];`, {
      signed: symName =>
        `[some?: string & { [${symName}]: {type: "string", max: 3} }, min3: string & { [${symName}]: {type: "string", min: 3} }]`,
      base: '[some?: string, min3: string]',
    });
  });
});
