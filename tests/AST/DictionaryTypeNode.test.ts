import { assertType } from '../util/assertType';
import { DictionaryTypeNode } from '../../src/types/AST/Node/TypeLiteralNode';
import { createDummyLocation } from '../util/createDummyLocation';

const location = createDummyLocation();

describe('DictionaryTypeNode :: ExportTypeDefinition', (): void => {
  test('Default', (): void => {
    const symName = 'sym';

    assertType(
      new DictionaryTypeNode({
        type: 'dictionary_type',
        payload: {
          properties: [
            {
              type: {
                type: 'string_type',
                payload: { min: null, max: { type: 'unsigned_integer', location, value: '3' } },
                location,
              },
              identifier: { type: 'identifier', payload: { name: 'some' }, location },
              optional: true,
            },
            {
              type: {
                type: 'string_type',
                payload: { max: null, min: { type: 'unsigned_integer', location, value: '3' } },
                location,
              },
              identifier: { type: 'identifier', payload: { name: 'min3' }, location },
              optional: false,
            },
          ],
        },
        location,
      }).exportTypeDefinition(symName),
      `{ some?: string & { [${symName}]: {type: "string", max: 3} }; min3: string & {[${symName}]: {type: "string", min: 3} } }`,
    );
  });
});
