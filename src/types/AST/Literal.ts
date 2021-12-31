import {
  Location,
  ParsedBooleanLiteral,
  ParsedFloatLiteral,
  ParsedSignedIntegerLiteral,
  ParsedStringLiteral,
  ParsedUnsignedIntegerLiteral,
} from '../ParsedAST';

// opaque typedef
const literalSign: unique symbol = Symbol();
abstract class Literal {
  private readonly [literalSign] = literalSign;

  protected constructor(public readonly location: Location) {}
}

export class UnsignedIntegerLiteral extends Literal {
  public readonly value: number;

  public constructor({ location, value }: ParsedUnsignedIntegerLiteral) {
    super(location);

    this.value = parseInt(value, 10);
  }
}

export class SignedIntegerLiteral extends Literal {
  public readonly value: number;

  public constructor({ location, value }: ParsedSignedIntegerLiteral) {
    super(location);

    this.value = parseInt(value, 10);
  }
}

export class FloatLiteral extends Literal {
  public readonly value: number;

  public constructor({ location, value }: ParsedFloatLiteral) {
    super(location);

    this.value = parseFloat(value);
  }
}

export class BooleanLiteral extends Literal {
  public readonly value: boolean;

  public constructor({ location, value }: ParsedBooleanLiteral) {
    super(location);

    this.value = value;
  }
}

export class StringLiteral extends Literal {
  public readonly value: string;

  public constructor({ location, value }: ParsedStringLiteral) {
    super(location);

    this.value = value;
  }
}
