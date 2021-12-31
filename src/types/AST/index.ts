import { ParsedAST } from '../ParsedAST';
import { RootNode } from './Node';
import { TypedefNode } from './Node/TypedefNode';

export class AST {
  public readonly rootNodes: ReadonlyArray<RootNode>;

  public constructor(a: ParsedAST) {
    this.rootNodes = a.map(t => new TypedefNode(t));
  }
}
