import { StringTypeNode } from '../../src/types/AST/Node/TypeLiteralNode';
import { parseFirstStatementIntoAST } from '../util/parseFirstStatementIntoAST';
import { wrapTypeNodeWithTypdeAliasStatement } from '../util/wrapTypeNodeWithTypdeAliasStatement';
import { assertAST } from '../util/assertAST';

const location = {
  source: null,
  start: { offset: 1, line: 3, column: 6 },
  end: { offset: 1, line: 3, column: 12 },
};

describe('StringTypeNode :: ExportTypeDefinition', (): void => {
  test('None', (): void => {
    const varName = 'X';
    const symName = 'sym';

    assertAST(
      wrapTypeNodeWithTypdeAliasStatement(
        varName,
        new StringTypeNode({
          type: 'string_type',
          payload: {
            min: null,
            max: null,
          },
          location,
        }).exportTypeDefinition(symName),
      ),
      parseFirstStatementIntoAST(`type ${varName} = string`),
    );
  });
  test('Min', (): void => {
    const varName = 'X';
    const symName = 'sym';

    assertAST(
      wrapTypeNodeWithTypdeAliasStatement(
        varName,
        new StringTypeNode({
          type: 'string_type',
          payload: {
            min: { type: 'unsigned_integer', value: '3', location },
            max: null,
          },
          location,
        }).exportTypeDefinition(symName),
      ),
      parseFirstStatementIntoAST(`type ${varName} = string & {[${symName}]: { type: "string"; min: 3 }}`),
    );
  });
  test('Max', (): void => {
    const varName = 'X';
    const symName = 'sym';

    assertAST(
      wrapTypeNodeWithTypdeAliasStatement(
        varName,
        new StringTypeNode({
          type: 'string_type',
          payload: {
            min: null,
            max: { type: 'unsigned_integer', value: '3', location },
          },
          location,
        }).exportTypeDefinition(symName),
      ),
      parseFirstStatementIntoAST(`type ${varName} = string & {[${symName}]: { type: "string"; max: 3 }}`),
    );
  });
  test('Min, Max', (): void => {
    const varName = 'X';
    const symName = 'sym';

    assertAST(
      wrapTypeNodeWithTypdeAliasStatement(
        varName,
        new StringTypeNode({
          type: 'string_type',
          payload: {
            min: { type: 'unsigned_integer', value: '3', location },
            max: { type: 'unsigned_integer', value: '4', location },
          },
          location,
        }).exportTypeDefinition(symName),
      ),
      parseFirstStatementIntoAST(`type ${varName} = string & {[${symName}]: { type: "string"; min: 3; max: 4 }}`),
    );
  });
});
