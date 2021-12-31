import { parse } from '../parser/parser';
import { promises as fs } from 'fs';
import { ParsedAST } from './types/ParsedAST';
import { AST } from './types/AST';
import { IdentifierString } from './types/AST/Node';
import { TypedefNode } from './types/AST/Node/TypedefNode';

async function main() {
  try {
    const fileName = process.argv[2];
    if (typeof fileName !== 'string') throw 'No filename provided';

    const schema = await fs.readFile(fileName, 'utf-8');

    // Parse schema with PEG parser
    const parsedSchemaAST: ParsedAST = parse(schema);

    // TODO: validate parsedSchemaAST

    // Transform parsed AST into rich AST
    const a = new AST(parsedSchemaAST);

    // TODO: resolve symbol table (import)

    // Check symbol table (dependency)
    const requiredTypes: { depending: IdentifierString; dependent: IdentifierString }[] = [];
    const definedTypes = new Set<IdentifierString>();
    a.rootNodes.forEach(r => {
      if (r instanceof TypedefNode) {
        r.getDependingTypes().forEach(n => requiredTypes.push({ depending: n, dependent: r.identifier.name }));
        definedTypes.add(r.identifier.name);
      }
    });
    requiredTypes.forEach(({ depending, dependent }) => {
      if (!definedTypes.has(depending)) {
        console.error(`Type "${depending}" is depended by type "${dependent}" but is not defined.`);
      }
    });

    // throw a;
  } catch (e) {
    console.dir(e, { depth: null, breakLength: 120 });
  }
}

main();

// Each constructor receives its corresponding type.
// A factory receives union type.
