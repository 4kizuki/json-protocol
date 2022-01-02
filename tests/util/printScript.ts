import * as ts from 'typescript';
import prettier from 'prettier';

const printer = ts.createPrinter({
  newLine: ts.NewLineKind.LineFeed,
});
const source = ts.createSourceFile('index.ts', '', ts.ScriptTarget.Latest, undefined, ts.ScriptKind.TS);

const DEBUG_LOG_SCRIPT = false;

export function printFormattedScript(n: ts.Node): string {
  const p = printer.printNode(ts.EmitHint.Unspecified, n, source);
  if (DEBUG_LOG_SCRIPT) console.log(p);
  return prettier.format(p, {
    parser: 'babel-ts',
    printWidth: 120,
    trailingComma: 'all',
    tabWidth: 2,
    semi: true,
    singleQuote: true,
    arrowParens: 'avoid',
  });
}
