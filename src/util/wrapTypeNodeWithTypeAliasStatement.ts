import * as ts from 'typescript';

export function wrapTypeNodeWithTypeAliasStatement(varName: string, node: ts.TypeNode): ts.Statement {
  return ts.factory.createTypeAliasDeclaration(undefined, undefined, varName, undefined, node);
}
