import {
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
  ParsedUnionTypeNode,
} from '../../../ParsedAST';
import {
  BooleanLiteral,
  FloatLiteral,
  SignedIntegerLiteral,
  StringLiteral,
  UnsignedIntegerLiteral,
} from '../../Literal';
import { IdentifierNode, IdentifierString, PropertyNameNode } from '../index';
import * as ts from 'typescript';
import { signTypeNode } from '../../../../util/signTypeNode';
import { TypeLiteralNode } from './index';
import { typeNodeFactory } from './factory';
import { TypeNodeWithGenerator } from './helper/TypeNodeWithGenerator';
import { getDependentIdentifiersFromUnion } from './helper/getDependentIdentifiersFromUnion';
import { TypeNodeOfTypes } from './helper/TypeNodeOfTypes';

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
    const original = this.exportBaseTypeDefinition();
    if (this.min === null && this.max === null) return original;

    return signTypeNode(original, symbolName, {
      type: 'string',
      min: this.min && this.min.value,
      max: this.max && this.max.value,
    });
  }

  public exportBaseTypeDefinition(): ts.TypeNode {
    return ts.factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword);
  }

  public exportJsonTypeDefinition(): ts.TypeNode {
    return this.exportBaseTypeDefinition();
  }

  public exportValidationLambda(symbolName: string): string {
    // language=typescript
    return `(base: ${this.exportBaseTypeDefinition()}): Result<${this.exportTypeDefinition(
      symbolName,
    )}, ParseError> => {
      ${this.min !== null ? `if (base.length < ${this.min.value}) throw new ParseError('');` : ''}
      ${this.max !== null ? `if (base.length > ${this.max.value}) throw new ParseError('');` : ''}
    `;
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
    return this.exportBaseTypeDefinition();
  }

  public exportBaseTypeDefinition(): ts.TypeNode {
    return ts.factory.createTypeReferenceNode('Date');
  }

  public exportJsonTypeDefinition(): ts.TypeNode {
    return ts.factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword);
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

  public exportTypeDefinition(symbolName: string): ts.TypeNode {
    return signTypeNode(this.exportBaseTypeDefinition(), symbolName, {
      type: 'integer',
      min: this.min && this.min.value,
      max: this.max && this.max.value,
    });
  }

  public exportBaseTypeDefinition(): ts.TypeNode {
    return ts.factory.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword);
  }

  public exportJsonTypeDefinition(): ts.TypeNode {
    return this.exportBaseTypeDefinition();
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

  public exportTypeDefinition(symbolName: string): ts.TypeNode {
    return signTypeNode(this.exportBaseTypeDefinition(), symbolName, {
      type: 'float',
      left: this.left && `${this.left[1]}| ${this.left[0].value}`,
      right: this.right && `${this.right[1]}| ${this.right[0].value}`,
    });
  }

  public exportBaseTypeDefinition(): ts.TypeNode {
    return ts.factory.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword);
  }

  public exportJsonTypeDefinition(): ts.TypeNode {
    return this.exportBaseTypeDefinition();
  }
}

export class BooleanTypeNode extends TypeLiteralNode {
  public constructor({ location }: ParsedBooleanTypeNode) {
    super(location);
  }

  public getDependingTypes(): Set<IdentifierString> {
    return new Set();
  }

  public exportTypeDefinition(symbolName: string): ts.TypeNode {
    return this.exportBaseTypeDefinition();
  }

  public exportBaseTypeDefinition(): ts.TypeNode {
    return ts.factory.createKeywordTypeNode(ts.SyntaxKind.BooleanKeyword);
  }

  public exportJsonTypeDefinition(): ts.TypeNode {
    return this.exportBaseTypeDefinition();
  }
}

export class NullTypeNode extends TypeLiteralNode {
  public constructor({ location }: ParsedNullTypeNode) {
    super(location);
  }

  public getDependingTypes(): Set<IdentifierString> {
    return new Set();
  }

  public exportTypeDefinition(symbolName: string): ts.TypeNode {
    return this.exportBaseTypeDefinition();
  }

  public exportBaseTypeDefinition(): ts.TypeNode {
    return ts.factory.createLiteralTypeNode(ts.factory.createNull());
  }

  public exportJsonTypeDefinition(): ts.TypeNode {
    return this.exportBaseTypeDefinition();
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

  public exportTypeDefinition(symbolName: string): ts.TypeNode {
    return this.exportBaseTypeDefinition();
  }

  public exportBaseTypeDefinition(): ts.TypeNode {
    return ts.factory.createLiteralTypeNode(ts.factory.createNumericLiteral(`${this.value.value}`));
  }

  public exportJsonTypeDefinition(): ts.TypeNode {
    return this.exportBaseTypeDefinition();
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

  public exportTypeDefinition(symbolName: string): ts.TypeNode {
    return this.exportBaseTypeDefinition();
  }

  public exportBaseTypeDefinition(): ts.TypeNode {
    return ts.factory.createLiteralTypeNode(ts.factory.createNumericLiteral(`${this.value.value}`));
  }

  public exportJsonTypeDefinition(): ts.TypeNode {
    return this.exportBaseTypeDefinition();
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

  public exportTypeDefinition(symbolName: string): ts.TypeNode {
    return this.exportBaseTypeDefinition();
  }

  public exportBaseTypeDefinition(): ts.TypeNode {
    return ts.factory.createLiteralTypeNode(this.value.value ? ts.factory.createTrue() : ts.factory.createFalse());
  }

  public exportJsonTypeDefinition(): ts.TypeNode {
    return this.exportBaseTypeDefinition();
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

  public exportTypeDefinition(symbolName: string): ts.TypeNode {
    return this.exportBaseTypeDefinition();
  }

  public exportBaseTypeDefinition(): ts.TypeNode {
    return ts.factory.createLiteralTypeNode(ts.factory.createStringLiteral(`${this.value.value}`));
  }

  public exportJsonTypeDefinition(): ts.TypeNode {
    return this.exportBaseTypeDefinition();
  }
}

export class DictionaryTypeNode extends TypeNodeWithGenerator {
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

  protected g(transformer: (x: TypeLiteralNode | IdentifierNode) => ts.TypeNode) {
    return ts.factory.createTypeLiteralNode(
      this.properties.map(property =>
        ts.factory.createPropertySignature(
          undefined,
          property.identifier.name,
          property.optional ? ts.factory.createToken(ts.SyntaxKind.QuestionToken) : undefined,
          transformer(property.type),
        ),
      ),
    );
  }
}

export class NamedTupleTypeNode extends TypeNodeWithGenerator {
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

  protected g(transformer: (x: TypeLiteralNode | IdentifierNode) => ts.TypeNode) {
    return ts.factory.createTupleTypeNode(
      this.elements.map(element =>
        ts.factory.createNamedTupleMember(
          undefined,
          ts.factory.createIdentifier(element.identifier.name),
          element.optional ? ts.factory.createToken(ts.SyntaxKind.QuestionToken) : undefined,
          transformer(element.type),
        ),
      ),
    );
  }
}

export class ArrayTypeNode extends TypeNodeWithGenerator {
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

  public exportTypeDefinition(symbolName: string): ts.TypeNode {
    const original = super.exportTypeDefinition(symbolName);

    if (this.min === null && this.max === null) return original;

    return signTypeNode(original, symbolName, {
      type: 'array',
      min: this.min && this.min.value,
      max: this.max && this.max.value,
    });
  }

  protected g(transformer: (x: TypeLiteralNode | IdentifierNode) => ts.TypeNode) {
    return ts.factory.createArrayTypeNode(transformer(this.type));
  }
}

export class TupleTypeNode extends TypeNodeOfTypes {
  public constructor({ payload: { elements }, location }: ParsedTupleTypeNode) {
    super(elements, location);
  }

  protected g(transformer: (x: TypeLiteralNode | IdentifierNode) => ts.TypeNode) {
    return ts.factory.createTupleTypeNode(this.types.map(transformer));
  }
}

export class IntersectionTypeNode extends TypeNodeOfTypes {
  public constructor({ payload: { types }, location }: ParsedIntersectionTypeNode) {
    super(types, location);
  }

  protected g(transformer: (x: TypeLiteralNode | IdentifierNode) => ts.TypeNode) {
    return ts.factory.createIntersectionTypeNode(this.types.map(transformer));
  }
}

export class UnionTypeNode extends TypeNodeOfTypes {
  public constructor({ payload: { types }, location }: ParsedUnionTypeNode) {
    super(types, location);
  }

  protected g(transformer: (x: TypeLiteralNode | IdentifierNode) => ts.TypeNode) {
    return ts.factory.createUnionTypeNode(this.types.map(transformer));
  }
}
