import { TypeLiteralNode } from '../../src/types/AST/Node/TypeLiteralNode';
import { parseSchema } from '../../src/parser';
import { TypedefNode } from '../../src/types/AST/Node/TypedefNode';

export function getNthType(schema: string, n: number = 0): TypeLiteralNode {
  const ast = parseSchema(schema);

  const typedef = ast.rootNodes[n];
  if (!(typedef instanceof TypedefNode)) fail(`The n-th node (${n}) was not an instance of TypedefNode.`);

  const { type } = typedef;
  if (!(type instanceof TypeLiteralNode)) fail(`The right hand of the n-th node (${n}) was not a type literal.`);

  return type;
}