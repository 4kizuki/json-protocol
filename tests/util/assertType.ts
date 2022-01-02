import * as ts from 'typescript';
import { assertAST } from './assertAST';
import { wrapTypeNodeWithTypdeAliasStatement } from './wrapTypeNodeWithTypdeAliasStatement';
import { parseFirstStatementIntoAST } from './parseFirstStatementIntoAST';

export function assertType(tested: ts.TypeNode, expected: string) {
  const varName = 'X';
  assertAST(
    wrapTypeNodeWithTypdeAliasStatement(varName, tested),
    parseFirstStatementIntoAST(`type ${varName} = ${expected}`),
  );
}
