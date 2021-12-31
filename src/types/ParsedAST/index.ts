export type Position = Readonly<{ offset: number; line: number; column: number }>;
export type Location = Readonly<{
  source: unknown;
  start: Position;
  end: Position;
}>;

type ASTLiteral<TType extends string, TValue> = Readonly<{
  type: TType;
  value: TValue;
  location: Location;
}>;

export type ParsedUnsignedIntegerLiteral = ASTLiteral<'unsigned_integer', string>;
export type ParsedSignedIntegerLiteral = ASTLiteral<'signed_integer', string>;
export type ParsedFloatLiteral = ASTLiteral<'float', string>;
export type ParsedBooleanLiteral = ASTLiteral<'boolean', boolean>;
export type ParsedStringLiteral = ASTLiteral<'string', string>;

export type ParsedAST = ReadonlyArray<ParsedTypedefNode>;

type ASTNode<TType extends string, TPayload> = Readonly<{
  type: TType;
  payload: TPayload;
  location: Location;
}>;

export type ParsedIdentifierNode = ASTNode<
  'identifier',
  {
    name: string;
  }
>;

export type ParsedTypedefNode = ASTNode<
  'typedef',
  {
    modifiers: never[] | ['export'];
    identifier: ParsedIdentifierNode;
    type: ParsedTypeNode;
  }
>;

export type ParsedTypeNode =
  | ParsedIntersectionTypeNode
  | ParsedUnionTypeNode
  | ParsedArrayTypeNode
  | ParsedStringTypeNode
  | ParsedDateStringTypeNode
  | ParsedIntegerTypeNode
  | ParsedFloatTypeNode
  | ParsedBooleanTypeNode
  | ParsedNullTypeNode
  | ParsedIntegerLiteralTypeNode
  | ParsedFloatLiteralTypeNode
  | ParsedBooleanLiteralTypeNode
  | ParsedStringLiteralTypeNode
  | ParsedDictionaryTypeNode
  | ParsedNamedTupleTypeNode
  | ParsedTupleTypeNode
  | ParsedIdentifierNode;

export type ParsedStringTypeNode = ASTNode<
  'string_type',
  {
    min: ParsedUnsignedIntegerLiteral | null;
    max: ParsedUnsignedIntegerLiteral | null;
  }
>;
export type ParsedDateStringTypeNode = ASTNode<'date_string_type', null>;
export type ParsedIntegerTypeNode = ASTNode<
  'integer_type',
  {
    min: ParsedSignedIntegerLiteral | null;
    max: ParsedSignedIntegerLiteral | null;
  }
>;
export type ParsedFloatTypeNode = ASTNode<
  'float_type',
  {
    left: [ParsedSignedIntegerLiteral | ParsedFloatLiteral, 'open' | 'closed'] | null;
    right: [ParsedSignedIntegerLiteral | ParsedFloatLiteral, 'open' | 'closed'] | null;
  }
>;
export type ParsedBooleanTypeNode = ASTNode<'boolean_type', null>;
export type ParsedNullTypeNode = ASTNode<'null_type', null>;

export type ParsedIntegerLiteralTypeNode = ASTNode<'integer_literal_type', { value: ParsedSignedIntegerLiteral }>;
export type ParsedFloatLiteralTypeNode = ASTNode<'float_literal_type', { value: ParsedFloatLiteral }>;
export type ParsedBooleanLiteralTypeNode = ASTNode<'boolean_literal_type', { value: ParsedBooleanLiteral }>;
export type ParsedStringLiteralTypeNode = ASTNode<'string_literal_type', { value: ParsedStringLiteral }>;

export type ParsedDictionaryTypeNode = ASTNode<
  'dictionary_type',
  {
    properties: {
      identifier: ParsedIdentifierNode;
      optional: boolean;
      type: ParsedTypeNode;
    }[];
  }
>;

export type ParsedNamedTupleTypeNode = ASTNode<
  'named_tuple_type',
  {
    elements: {
      identifier: ParsedIdentifierNode;
      optional: boolean;
      type: ParsedTypeNode;
    }[];
  }
>;

export type ParsedTupleTypeNode = ASTNode<'tuple_type', { types: ParsedTypeNode[] }>;

export type ParsedArrayTypeNode = ASTNode<
  'array_type',
  {
    type: ParsedTypeNode;
    min: ParsedUnsignedIntegerLiteral | null;
    max: ParsedUnsignedIntegerLiteral | null;
  }
>;

export type ParsedIntersectionTypeNode = ASTNode<
  'intersection_type',
  {
    types: ParsedTypeNode[];
  }
>;

export type ParsedUnionTypeNode = ASTNode<
  'union_type',
  {
    types: ParsedTypeNode[];
  }
>;
