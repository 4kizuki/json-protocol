import { IdentifierString, Node } from '../index';
import * as ts from 'typescript';

// opaque typedef
const typeLiteralSign: unique symbol = Symbol();

export abstract class TypeLiteralNode extends Node {
  private readonly [typeLiteralSign] = typeLiteralSign;

  public abstract getDependingTypes(): Set<IdentifierString>;

  public abstract exportTypeDefinition(symbolName: string): ts.TypeNode;

  public abstract exportBaseTypeDefinition(): ts.TypeNode;

  public abstract exportJsonTypeDefinition(): ts.TypeNode;

  // public abstract exportValidationLambda(symbolName: string): string;
  // public abstract exportToJSONLambda(): string;
  // public abstract exportFromJSONLambda(): string;
}
