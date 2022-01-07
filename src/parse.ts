import { promises as fs } from 'fs';
import { TypedefNode } from './types/AST/Node/TypedefNode';
import { TypeLiteralNode } from './types/AST/Node/TypeLiteralNode/TypeLiteralNode';
import { printFormattedScript } from './util/printScript';
import { wrapTypeNodeWithTypeAliasStatement } from './util/wrapTypeNodeWithTypeAliasStatement';
import { parseSchema } from './parser';

async function main() {
  try {
    const fileName = process.argv[2];
    if (typeof fileName !== 'string') throw 'No filename provided';

    const schema = await fs.readFile(fileName, 'utf-8');
    const ast = parseSchema(schema);

    const symName = 'jsonProto';

    ast.rootNodes.forEach(n => {
      if (n instanceof TypedefNode) {
        const { type } = n;
        if (type instanceof TypeLiteralNode) {
          const def = type.exportTypeDefinition(symName);
          console.log(printFormattedScript(wrapTypeNodeWithTypeAliasStatement(n.identifier.name, def)));
        }
      }
    });

    // throw a;
  } catch (e) {
    console.dir(e, { depth: null, breakLength: 120 });
  }
}

main();
