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

// export const roleMiddleware = (allowedRoles: string[]) => (req: Request & { user: ReqUser }, res: Response, next: NextFunction): void => {
//   if (!req.user) {
//     throw new UnauthorizedException('Not authenticated')
//   }
//   if (!allowedRoles.includes(req.user?.role)) {
//     throw new UnauthorizedException('No permissions')
//   }
//   next()
// }
