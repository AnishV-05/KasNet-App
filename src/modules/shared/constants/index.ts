export enum ResponseErrorMessage {
  IncorrectUser = 'Incorrect username or password.',
  PasswordAttempts = 'Password attempts exceeded.',
  TokenExpired = 'Token is expired',
  UserNotFound = 'User not found.',
}

export enum ResponseErrorException {
  UNAUTHORIZED_EXCEPTION = 'Unauthorized',
  VERIFY_RECAPTCHA_EXCEPTION = 'VERIFY_RECAPTCHA_EXCEPTION',
}
