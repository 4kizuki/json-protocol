import * as ts from 'typescript';
import { wrapTypeNodeWithTypeAliasStatement } from '../../src/util/wrapTypeNodeWithTypeAliasStatement';
import { printFormattedScript } from '../../src/util/printScript';

function parseFirstStatementIntoAST(source: string): ts.Node {
  return ts.createSourceFile('', source, ts.ScriptTarget.Latest, undefined, ts.ScriptKind.TS).statements[0];
}

function assertAST(tested: ts.Node, expected: ts.Node) {
  expect(printFormattedScript(tested)).toEqual(printFormattedScript(expected));
}

export function assertType(tested: ts.TypeNode, expected: string) {
  const varName = 'X';
  assertAST(
    wrapTypeNodeWithTypeAliasStatement(varName, tested),
    parseFirstStatementIntoAST(`type ${varName} = ${expected}`),
  );
}
