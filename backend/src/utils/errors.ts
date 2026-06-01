export class AppError extends Error {
  constructor(public statusCode: number, public message: string) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}

export class InvalidCredentialsError extends AppError {
  constructor(message = 'Invalid email or password') {
    super(401, message);
  }
}

export class UserNotFoundError extends AppError {
  constructor(message = 'User not found') {
    super(404, message);
  }
}

export class OTPExpiredError extends AppError {
  constructor(message = 'OTP has expired') {
    super(400, message);
  }
}

export class OTPInvalidError extends AppError {
  constructor(message = 'Invalid OTP provided') {
    super(400, message);
  }
}

export class EmailAlreadyExistsError extends AppError {
  constructor(message = 'Email is already registered') {
    super(409, message);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized access') {
    super(403, message);
  }
}

export class ValidationError extends AppError {
  constructor(message = 'Validation failed') {
    super(400, message);
  }
}