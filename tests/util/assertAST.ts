import { printFormattedScript } from './printScript';
import * as ts from 'typescript';

export function assertAST(tested: ts.Node, expected: ts.Node) {
  expect(printFormattedScript(tested)).toEqual(printFormattedScript(expected));
}
