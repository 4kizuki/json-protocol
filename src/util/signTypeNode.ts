import * as ts from 'typescript';

export function signTypeNode(
  original: ts.TypeNode,
  symName: string,
  sign: {
    [key in string]?: string | number | undefined | null;
  },
): ts.TypeNode {
  return ts.factory.createIntersectionTypeNode([
    original,
    ts.factory.createTypeLiteralNode([
      ts.factory.createPropertySignature(
        undefined,
        ts.factory.createComputedPropertyName(ts.factory.createIdentifier(symName)),
        undefined,
        ts.factory.createTypeLiteralNode(
          Object.entries(sign)
            .map<ts.PropertySignature | null>(([key, value]) =>
              typeof value === 'number' || typeof value === 'string'
                ? ts.factory.createPropertySignature(
                    undefined,
                    key,
                    undefined,
                    typeof value === 'number'
                      ? ts.factory.createLiteralTypeNode(ts.factory.createNumericLiteral(value))
                      : ts.factory.createLiteralTypeNode(ts.factory.createStringLiteral(value)),
                  )
                : null,
            )
            .filter<ts.PropertySignature>((t): t is ts.PropertySignature => t !== null),
        ),
      ),
    ]),
  ]);
}
