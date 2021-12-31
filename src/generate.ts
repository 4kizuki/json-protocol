import * as peggy from 'peggy';
import { promises as fs } from 'fs';

async function main() {
  try {
    const f = await fs.readFile('parser/syntax.pegjs', 'utf-8');
    const parser = peggy.generate(f, {
      output: 'source',
      format: 'commonjs',
      plugins: [require('ts-pegjs')],
    });
    await fs.writeFile('parser/parser.ts', parser);
  } catch (e: unknown) {
    console.dir(e, { depth: null, breakLength: 120 });
  }
}

main();
