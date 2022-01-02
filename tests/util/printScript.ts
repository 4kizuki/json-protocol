import * as ts from 'typescript';
import prettier from 'prettier';

const printer = ts.createPrinter({
  newLine: ts.NewLineKind.LineFeed,
});
const source = ts.createSourceFile('index.ts', '', ts.ScriptTarget.Latest, undefined, ts.ScriptKind.TS);

export function printFormattedScript(n: ts.Node): string {
  return prettier.format(printer.printNode(ts.EmitHint.Unspecified, n, source), {
    parser: 'babel',
    printWidth: 120,
    trailingComma: 'all',
    tabWidth: 2,
    semi: true,
    singleQuote: true,
    arrowParens: 'avoid',
  });
}
