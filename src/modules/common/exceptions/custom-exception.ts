export class CustomException extends Error {
  public code: number;
  public details: unknown;

  constructor(message: string, code: number, details?: unknown) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }
}
