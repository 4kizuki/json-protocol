import { TypeLiteralNode } from '../index';
import { IdentifierNode, IdentifierString } from '../../index';

export function getDependentIdentifiersFromUnion(type: TypeLiteralNode | IdentifierNode): Set<IdentifierString> {
  const ret = new Set<IdentifierString>();
  if (type instanceof IdentifierNode) {
    ret.add(type.name);
  } else {
    type.getDependingTypes().forEach(n => ret.add(n));
  }
  return ret;
}