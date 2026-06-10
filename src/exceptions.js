export class VinDecoderError extends Error {
  constructor(message) {
    super(message);
    this.name = 'VinDecoderError';
  }
}

export class InvalidArgumentError extends VinDecoderError {
  constructor(message) {
    super(message);
    this.name = 'InvalidArgumentError';
  }
}

export class NetworkError extends VinDecoderError {
  constructor(message) {
    super(message);
    this.name = 'NetworkError';
  }
}

export class ApiError extends VinDecoderError {
  constructor(message, statusCode, responseBody) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.responseBody = responseBody;
  }
}

export class AuthenticationError extends ApiError {
  constructor(message, statusCode, responseBody) {
    super(message, statusCode, responseBody);
    this.name = 'AuthenticationError';
  }
}