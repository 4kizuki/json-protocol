import {
  Location,
  ParsedArrayTypeNode,
  ParsedBooleanLiteralTypeNode,
  ParsedBooleanTypeNode,
  ParsedDateStringTypeNode,
  ParsedDictionaryTypeNode,
  ParsedFloatLiteralTypeNode,
  ParsedFloatTypeNode,
  ParsedIntegerLiteralTypeNode,
  ParsedIntegerTypeNode,
  ParsedIntersectionTypeNode,
  ParsedNamedTupleTypeNode,
  ParsedNullTypeNode,
  ParsedStringLiteralTypeNode,
  ParsedStringTypeNode,
  ParsedTupleTypeNode,
  ParsedTypeNode,
  ParsedUnionTypeNode,
} from '../../ParsedAST';
import { BooleanLiteral, FloatLiteral, SignedIntegerLiteral, StringLiteral, UnsignedIntegerLiteral } from '../Literal';
import { IdentifierNode, IdentifierString, Node, PropertyNameNode } from './index';
import * as ts from 'typescript';

export function typeNodeFactory(parsed: ParsedTypeNode): TypeLiteralNode | IdentifierNode {
  switch (parsed.type) {
    case 'intersection_type':
      return new IntersectionTypeNode(parsed);
    case 'union_type':
      return new UnionTypeNode(parsed);
    case 'array_type':
      return new ArrayTypeNode(parsed);
    case 'string_type':
      return new StringTypeNode(parsed);
    case 'date_string_type':
      return new DateStringTypeNode(parsed);
    case 'integer_type':
      return new IntegerTypeNode(parsed);
    case 'float_type':
      return new FloatTypeNode(parsed);
    case 'boolean_type':
      return new BooleanTypeNode(parsed);
    case 'null_type':
      return new NullTypeNode(parsed);
    case 'integer_literal_type':
      return new IntegerLiteralTypeNode(parsed);
    case 'float_literal_type':
      return new FloatLiteralTypeNode(parsed);
    case 'boolean_literal_type':
      return new BooleanLiteralTypeNode(parsed);
    case 'string_literal_type':
      return new StringLiteralTypeNode(parsed);
    case 'dictionary_type':
      return new DictionaryTypeNode(parsed);
    case 'named_tuple_type':
      return new NamedTupleTypeNode(parsed);
    case 'tuple_type':
      return new TupleTypeNode(parsed);
    case 'identifier':
      return new IdentifierNode(parsed);
  }
}

// opaque typedef
const typeLiteralSign: unique symbol = Symbol();

export abstract class TypeLiteralNode extends Node {
  private readonly [typeLiteralSign] = typeLiteralSign;

  public abstract getDependingTypes(): Set<IdentifierString>;
}

// helper function
function getDependentIdentifiersFromUnion(type: TypeLiteralNode | IdentifierNode): Set<IdentifierString> {
  const ret = new Set<IdentifierString>();
  if (type instanceof IdentifierNode) {
    ret.add(type.name);
  } else {
    type.getDependingTypes().forEach(n => ret.add(n));
  }
  return ret;
}

// helper class
class TypeNodeOfTypes extends TypeLiteralNode {
  public readonly types: (TypeLiteralNode | IdentifierNode)[];

  protected constructor(types: ParsedTypeNode[], location: Location) {
    super(location);

    this.types = types.map(t => typeNodeFactory(t));
  }

  public getDependingTypes(): Set<IdentifierString> {
    const ret = new Set<IdentifierString>();
    this.types.forEach(type => getDependentIdentifiersFromUnion(type).forEach(n => ret.add(n)));
    return ret;
  }
}

export class StringTypeNode extends TypeLiteralNode {
  public readonly min: UnsignedIntegerLiteral | null;
  public readonly max: UnsignedIntegerLiteral | null;

  public constructor({ payload: { min, max }, location }: ParsedStringTypeNode) {
    super(location);
    this.min = min && new UnsignedIntegerLiteral(min);
    this.max = max && new UnsignedIntegerLiteral(max);
  }

  public getDependingTypes(): Set<IdentifierString> {
    return new Set();
  }

  public exportTypeDefinition(symbolName: string): ts.TypeNode {
    if (this.min === null && this.max === null) return ts.factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword);

    const signatures: ts.TypeElement[] = [
      ts.factory.createPropertySignature(
        undefined,
        ts.factory.createIdentifier('type'),
        undefined,
        ts.factory.createLiteralTypeNode(ts.factory.createStringLiteral('string')),
      ),
    ];
    (['min', 'max'] as const).forEach(propName => {
      const prop = this[propName];
      if (prop === null) return;

      signatures.push(
        ts.factory.createPropertySignature(
          undefined,
          ts.factory.createIdentifier(propName),
          undefined,
          ts.factory.createLiteralTypeNode(ts.factory.createNumericLiteral(prop.value)),
        ),
      );
    });

    return ts.factory.createIntersectionTypeNode([
      ts.factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword),
      ts.factory.createTypeLiteralNode([
        ts.factory.createPropertySignature(
          undefined,
          ts.factory.createComputedPropertyName(ts.factory.createIdentifier(symbolName)),
          undefined,
          ts.factory.createTypeLiteralNode(signatures),
        ),
      ]),
    ]);
  }
}

export class DateStringTypeNode extends TypeLiteralNode {
  public constructor({ location }: ParsedDateStringTypeNode) {
    super(location);
  }

  public getDependingTypes(): Set<IdentifierString> {
    return new Set();
  }

  public exportTypeDefinition(symbolName: string): ts.TypeNode {
    const signatures: ts.TypeElement[] = [
      ts.factory.createPropertySignature(
        undefined,
        ts.factory.createIdentifier('type'),
        undefined,
        ts.factory.createLiteralTypeNode(ts.factory.createStringLiteral('date-string')),
      ),
    ];

    return ts.factory.createIntersectionTypeNode([
      ts.factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword),
      ts.factory.createTypeLiteralNode([
        ts.factory.createPropertySignature(
          undefined,
          ts.factory.createComputedPropertyName(ts.factory.createIdentifier(symbolName)),
          undefined,
          ts.factory.createTypeLiteralNode(signatures),
        ),
      ]),
    ]);
  }
}

export class IntegerTypeNode extends TypeLiteralNode {
  public readonly min: SignedIntegerLiteral | null;
  public readonly max: SignedIntegerLiteral | null;

  public constructor({ payload: { min, max }, location }: ParsedIntegerTypeNode) {
    super(location);

    this.min = min && new SignedIntegerLiteral(min);
    this.max = max && new SignedIntegerLiteral(max);
  }

  public getDependingTypes(): Set<IdentifierString> {
    return new Set();
  }
}

export class FloatTypeNode extends TypeLiteralNode {
  public readonly left: [FloatLiteral, 'open' | 'closed'] | null;
  public readonly right: [FloatLiteral, 'open' | 'closed'] | null;

  public constructor({ payload: { left, right }, location }: ParsedFloatTypeNode) {
    super(location);

    this.left = left && [new FloatLiteral({ ...left[0], type: 'float' }), left[1]];
    this.right = right && [new FloatLiteral({ ...right[0], type: 'float' }), right[1]];
  }

  public getDependingTypes(): Set<IdentifierString> {
    return new Set();
  }
}

export class BooleanTypeNode extends TypeLiteralNode {
  public constructor({ location }: ParsedBooleanTypeNode) {
    super(location);
  }

  public getDependingTypes(): Set<IdentifierString> {
    return new Set();
  }
}

export class NullTypeNode extends TypeLiteralNode {
  public constructor({ location }: ParsedNullTypeNode) {
    super(location);
  }

  public getDependingTypes(): Set<IdentifierString> {
    return new Set();
  }
}

export class IntegerLiteralTypeNode extends TypeLiteralNode {
  public readonly value: SignedIntegerLiteral;

  public constructor({ payload: { value }, location }: ParsedIntegerLiteralTypeNode) {
    super(location);

    this.value = new SignedIntegerLiteral(value);
  }

  public getDependingTypes(): Set<IdentifierString> {
    return new Set();
  }
}

export class FloatLiteralTypeNode extends TypeLiteralNode {
  public readonly value: FloatLiteral;

  public constructor({ payload: { value }, location }: ParsedFloatLiteralTypeNode) {
    super(location);

    this.value = new FloatLiteral(value);
  }

  public getDependingTypes(): Set<IdentifierString> {
    return new Set();
  }
}

export class BooleanLiteralTypeNode extends TypeLiteralNode {
  public readonly value: BooleanLiteral;

  public constructor({ payload: { value }, location }: ParsedBooleanLiteralTypeNode) {
    super(location);

    this.value = new BooleanLiteral(value);
  }

  public getDependingTypes(): Set<IdentifierString> {
    return new Set();
  }
}

export class StringLiteralTypeNode extends TypeLiteralNode {
  public readonly value: StringLiteral;

  public constructor({ payload: { value }, location }: ParsedStringLiteralTypeNode) {
    super(location);

    this.value = new StringLiteral(value);
  }

  public getDependingTypes(): Set<IdentifierString> {
    return new Set();
  }
}

export class DictionaryTypeNode extends TypeLiteralNode {
  public readonly properties: ReadonlyArray<{
    identifier: PropertyNameNode;
    optional: boolean;
    type: TypeLiteralNode | IdentifierNode;
  }>;

  public constructor({ payload: { properties }, location }: ParsedDictionaryTypeNode) {
    super(location);

    this.properties = properties.map(p => ({
      identifier: new PropertyNameNode(p.identifier),
      optional: p.optional,
      type: typeNodeFactory(p.type),
    }));
  }

  public getDependingTypes(): Set<IdentifierString> {
    const ret = new Set<IdentifierString>();
    this.properties.forEach(({ type }) => getDependentIdentifiersFromUnion(type).forEach(n => ret.add(n)));
    return ret;
  }
}

export class NamedTupleTypeNode extends TypeLiteralNode {
  public readonly elements: ReadonlyArray<{
    identifier: PropertyNameNode;
    optional: boolean;
    type: TypeLiteralNode | IdentifierNode;
  }>;

  public constructor({ payload: { elements }, location }: ParsedNamedTupleTypeNode) {
    super(location);

    this.elements = elements.map(p => ({
      identifier: new PropertyNameNode(p.identifier),
      optional: p.optional,
      type: typeNodeFactory(p.type),
    }));
  }

  public getDependingTypes(): Set<IdentifierString> {
    const ret = new Set<IdentifierString>();
    this.elements.forEach(({ type }) => getDependentIdentifiersFromUnion(type).forEach(n => ret.add(n)));
    return ret;
  }
}

export class ArrayTypeNode extends TypeLiteralNode {
  public readonly min: UnsignedIntegerLiteral | null;
  public readonly max: UnsignedIntegerLiteral | null;
  public readonly type: TypeLiteralNode | IdentifierNode;

  public constructor({ payload: { type, min, max }, location }: ParsedArrayTypeNode) {
    super(location);

    this.min = min && new UnsignedIntegerLiteral(min);
    this.max = max && new UnsignedIntegerLiteral(max);
    this.type = typeNodeFactory(type);
  }

  public getDependingTypes(): Set<IdentifierString> {
    return getDependentIdentifiersFromUnion(this.type);
  }
}

export class TupleTypeNode extends TypeNodeOfTypes {
  public constructor({ payload: { types }, location }: ParsedTupleTypeNode) {
    super(types, location);
  }
}

export class IntersectionTypeNode extends TypeNodeOfTypes {
  public constructor({ payload: { types }, location }: ParsedIntersectionTypeNode) {
    super(types, location);
  }
}

export class UnionTypeNode extends TypeNodeOfTypes {
  public constructor({ payload: { types }, location }: ParsedUnionTypeNode) {
    super(types, location);
  }
}
