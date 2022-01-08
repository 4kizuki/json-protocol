export class ValidationError extends Error {
  public constructor(message: string) {
    super(message);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ValidationError);
    }
  }
}

Object.defineProperty(ValidationError.prototype, 'name', {
  configurable: true,
  enumerable: false,
  value: ValidationError.name,
  writable: true,
});
