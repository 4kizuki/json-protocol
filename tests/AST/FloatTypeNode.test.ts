import { assertType } from '../util/assertType';
import { FloatTypeNode, IntegerTypeNode } from '../../src/types/AST/Node/TypeLiteralNode';
import { createDummyLocation } from '../util/createDummyLocation';

const location = createDummyLocation();

describe('FloatTypeNode :: ExportTypeDefinition', (): void => {
  test('None', (): void => {
    const symName = 'sym';

    assertType(
      new FloatTypeNode({
        type: 'float_type',
        payload: {
          left: null,
          right: null,
        },
        location,
      }).exportTypeDefinition(symName),
      `number & {[${symName}]: { type: "float" }`,
    );
  });

  test('Left', (): void => {
    const symName = 'sym';

    assertType(
      new FloatTypeNode({
        type: 'float_type',
        payload: {
          left: [{ type: 'signed_integer', value: '-3', location }, 'open'],
          right: null,
        },
        location,
      }).exportTypeDefinition(symName),
      `number & {[${symName}]: { type: "float", left: "open| -3" }`,
    );
  });

  test('Right', (): void => {
    const symName = 'sym';

    assertType(
      new FloatTypeNode({
        type: 'float_type',
        payload: {
          left: null,
          right: [{ type: 'float', value: '3.2294', location }, 'closed'],
        },
        location,
      }).exportTypeDefinition(symName),
      `number & {[${symName}]: { type: "float", right: "closed| 3.2294" }`,
    );
  });

  test('Left, Right', (): void => {
    const symName = 'sym';

    assertType(
      new FloatTypeNode({
        type: 'float_type',
        payload: {
          left: [{ type: 'float', value: '-3.3392', location }, 'closed'],
          right: [{ type: 'signed_integer', value: '3', location }, 'open'],
        },
        location,
      }).exportTypeDefinition(symName),
      `number & {[${symName}]: { type: "float", left: "closed| -3.3392", right: "open| 3" }`,
    );
  });
});
