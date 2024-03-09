export class Exception extends Error {
  statusCode: number
  constructor (message: string, statusCode: number) {
    super(message)
    this.statusCode = statusCode
  }
}

export class InvalidDataException extends Exception {
  constructor (message: string) {
    super(message, 400)
  }
}

export class NotFoundException extends Exception {
  constructor (message: string) {
    super(message, 404)
  }
}

export class UnauthorizedException extends Exception {
  constructor (message: string) {
    super(message, 401)
  }
}
