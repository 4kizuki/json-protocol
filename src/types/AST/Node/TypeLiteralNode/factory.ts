import { ParsedTypeNode } from '../../../ParsedAST';
import { IdentifierNode } from '../index';
import {
  ArrayTypeNode,
  BooleanLiteralTypeNode,
  BooleanTypeNode,
  DateStringTypeNode,
  DictionaryTypeNode,
  FloatLiteralTypeNode,
  FloatTypeNode,
  IntegerLiteralTypeNode,
  IntegerTypeNode,
  IntersectionTypeNode,
  NamedTupleTypeNode,
  NullTypeNode,
  StringLiteralTypeNode,
  StringTypeNode,
  TupleTypeNode,
  UnionTypeNode,
} from './TypeLiteralNode';
import { TypeLiteralNode } from './index';

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
