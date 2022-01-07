import { TypeNodeWithGenerator } from './TypeNodeWithGenerator';
import { TypeLiteralNode } from '../index';
import { IdentifierNode, IdentifierString } from '../../index';
import { Location, ParsedTypeNode } from '../../../../ParsedAST';
import { typeNodeFactory } from '../factory';
import { getDependentIdentifiersFromUnion } from './getDependentIdentifiersFromUnion';

export abstract class TypeNodeOfTypes extends TypeNodeWithGenerator {
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
