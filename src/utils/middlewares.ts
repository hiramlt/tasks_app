import passport from 'passport'
import { UnauthorizedException } from './errors'
import type { Request, Response, NextFunction } from 'express'
import type { ReqUser } from '../types'

export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  passport.authenticate('jwt', { session: false }, (error: Error, payload: ReqUser, info: { message: string }) => {
    if (error) {
      next(error)
    }
    if (!payload) {
      throw new UnauthorizedException(info.message)
    }
    req.user = payload
    next()
  })(req, res, next)
}
