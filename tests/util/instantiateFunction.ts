import * as ts from 'typescript';
import { ValidationError } from '../../src/errors/ValidationError';

export function instantiateFunction(a: ts.ArrowFunction): (...args: unknown[]) => unknown {
  const printer = ts.createPrinter({
    newLine: ts.NewLineKind.LineFeed,
  });
  const typeScriptCode = printer.printNode(
    ts.EmitHint.Unspecified,
    a,
    ts.createSourceFile('index.ts', '', ts.ScriptTarget.Latest, undefined, ts.ScriptKind.TS),
  );
  const javaScriptCode = ts.transpile(typeScriptCode, {
    target: ts.ScriptTarget.ES5,
    module: ts.ModuleKind.CommonJS,
  });
  return Function(`return (ValidationError) => ${javaScriptCode}`)()(ValidationError);
}