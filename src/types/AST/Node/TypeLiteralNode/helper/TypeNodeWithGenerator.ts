import { TypeLiteralNode } from '../index';
import * as ts from 'typescript';
import { IdentifierNode } from '../../index';

export abstract class TypeNodeWithGenerator extends TypeLiteralNode {
  public exportTypeDefinition(symbolName: string): ts.TypeNode {
    return this.g(type => toTsTypeNode.signed(symbolName, type));
  }

  public exportBaseTypeDefinition(): ts.TypeNode {
    return this.g(toTsTypeNode.base);
  }

  public exportJsonTypeDefinition(): ts.TypeNode {
    return this.g(toTsTypeNode.json);
  }

  protected abstract g(transformer: (x: TypeLiteralNode | IdentifierNode) => ts.TypeNode): ts.TypeNode;
}

namespace toTsTypeNode {
  function getBaseType(name: string): ts.TypeNode {
    return ts.factory.createTypeReferenceNode(
      ts.factory.createQualifiedName(ts.factory.createIdentifier(name), 'BaseType'),
    );
  }

  function getJsonType(name: string): ts.TypeNode {
    return ts.factory.createTypeReferenceNode(
      ts.factory.createQualifiedName(ts.factory.createIdentifier(name), 'JsonType'),
    );
  }

  export function signed(symbolName: string, type: TypeLiteralNode | IdentifierNode): ts.TypeNode {
    if (type instanceof TypeLiteralNode) return type.exportTypeDefinition(symbolName);
    return ts.factory.createTypeReferenceNode(type.name);
  }

  export function base(type: TypeLiteralNode | IdentifierNode): ts.TypeNode {
    if (type instanceof TypeLiteralNode) return type.exportBaseTypeDefinition();
    return getBaseType(type.name);
  }

  export function json(type: TypeLiteralNode | IdentifierNode): ts.TypeNode {
    if (type instanceof TypeLiteralNode) return type.exportJsonTypeDefinition();
    return getJsonType(type.name);
  }
}
