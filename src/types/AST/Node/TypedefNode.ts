import { TypeLiteralNode, typeNodeFactory } from './TypeLiteralNode';
import { ParsedTypedefNode } from '../../ParsedAST';
import { IdentifierNode, IdentifierString, RootNode } from './index';

export class TypedefNode extends RootNode {
  public readonly modifiers: Set<'export'>;
  public readonly identifier: IdentifierNode;
  public readonly type: TypeLiteralNode | IdentifierNode;

  public constructor({ payload: { modifiers, identifier, type }, location }: ParsedTypedefNode) {
    super(location);

    this.modifiers = new Set<'export'>(modifiers);
    this.identifier = new IdentifierNode(identifier);
    this.type = typeNodeFactory(type);
  }

  public getDependingTypes(): Set<IdentifierString> {
    if (this.type instanceof IdentifierNode) return new Set([this.type.name]);
    return this.type.getDependingTypes();
  }
}
