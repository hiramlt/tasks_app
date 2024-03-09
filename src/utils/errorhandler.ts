import type { ErrorRequestHandler } from 'express'
import { Exception } from './errors'

export const errorHandler: ErrorRequestHandler = (error, req, res, next) => {
  const errorData = { status: 500, message: `Unexpected error: ${error.message}` }
  if (error instanceof Exception) {
    errorData.status = error.statusCode
    errorData.message = error.message
  }
  res.status(errorData.status).json({ error: errorData.message })
  next()
}
