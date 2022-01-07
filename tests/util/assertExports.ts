import { TypeLiteralNode } from '../../src/types/AST/Node/TypeLiteralNode';
import { assertType } from './assertType';
import { getNthType } from './getNthType';

export function assertExports(
  // if schema is passed (string), the first node ([0]) will be used to test.
  schemaOrTypeLiteral: string | TypeLiteralNode,
  expectations: {
    signed?: string | ((symName: string) => string);
    base: string;
    json?: string;
  },
) {
  const instance = typeof schemaOrTypeLiteral === 'string' ? getNthType(schemaOrTypeLiteral) : schemaOrTypeLiteral;
  const { base } = expectations;
  const { signed = base, json = base } = expectations;

  const symName = 'sym';
  assertType(instance.exportTypeDefinition(symName), typeof signed === 'string' ? signed : signed(symName));
  assertType(instance.exportBaseTypeDefinition(), base);
  assertType(instance.exportJsonTypeDefinition(), json);
}
