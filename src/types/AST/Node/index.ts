import { Location, ParsedIdentifierNode } from '../../ParsedAST';

// opaque typedef
const nodeSign: unique symbol = Symbol();

export abstract class Node {
  private readonly [nodeSign] = nodeSign;

  protected constructor(public readonly location: Location) {}
}

// opaque typedef
const identifierNodeSign: unique symbol = Symbol();

const isSign: unique symbol = Symbol();
export type IdentifierString = string & { [isSign]: never };
export class IdentifierNode extends Node {
  private readonly [identifierNodeSign] = identifierNodeSign;
  public readonly name: IdentifierString;

  public constructor({ payload: { name }, location }: ParsedIdentifierNode) {
    super(location);
    this.name = name as IdentifierString;
  }
}

// opaque typedef
const propertyNameSign: unique symbol = Symbol();

const pnSign: unique symbol = Symbol();
export type PropertyNameString = string & { [pnSign]: never };
export class PropertyNameNode extends Node {
  private readonly [propertyNameSign] = propertyNameSign;
  public readonly name: PropertyNameString;

  public constructor({ payload: { name }, location }: ParsedIdentifierNode) {
    super(location);
    this.name = name as PropertyNameString;
  }
}

// opaque typedef
const rootSign: unique symbol = Symbol();

export abstract class RootNode extends Node {
  private readonly [rootSign] = rootSign;
}
