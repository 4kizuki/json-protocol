import { AST } from '../types/AST';
import { ParsedAST } from '../types/ParsedAST';
import { IdentifierString } from '../types/AST/Node';
import { TypedefNode } from '../types/AST/Node/TypedefNode';
import { parse } from '../../parser/parser';

export function parseSchema(schema: string): AST {
  // Parse schema with PEG parser
  const parsedSchemaAST: ParsedAST = parse(schema);

  // TODO: validate parsedSchemaAST

  // Transform parsed AST into rich AST
  const ast = new AST(parsedSchemaAST);

  // TODO: resolve symbol table (import)

  // Check symbol table (dependency)
  const requiredTypes: { depending: IdentifierString; dependent: IdentifierString }[] = [];
  const definedTypes = new Set<IdentifierString>();
  ast.rootNodes.forEach(r => {
    if (r instanceof TypedefNode) {
      r.getDependingTypes().forEach(n => requiredTypes.push({ depending: n, dependent: r.identifier.name }));
      if (definedTypes.has(r.identifier.name)) {
        console.error(`Type "${r.identifier.name}" is declared twice.`);
      }
      definedTypes.add(r.identifier.name);
    }
  });
  requiredTypes.forEach(({ depending, dependent }) => {
    if (!definedTypes.has(depending)) {
      console.error(`Type "${depending}" is depended by type "${dependent}" but is not defined.`);
    }
  });

  return ast;
}
