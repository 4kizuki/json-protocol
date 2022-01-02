import * as ts from 'typescript';

export function parseFirstStatementIntoAST(source: string): ts.Node {
  return ts.createSourceFile('', source, ts.ScriptTarget.Latest, undefined, ts.ScriptKind.TS).statements[0];
}
