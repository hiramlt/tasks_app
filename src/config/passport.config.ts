import passport from 'passport'
import config from './config'
import type { Request } from 'express'
import { ExtractJwt, Strategy as JwtStratrgy } from 'passport-jwt'

const cookieExtractor = (req: Request): string => {
  let token
  if (req?.signedCookies) {
    token = req.signedCookies.access_token
  }
  return token
}

export const initPassport = (): void => {
  const opts = {
    secretOrKey: config.jwtSecret,
    jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor])
  }
  passport.use('jwt', new JwtStratrgy(opts, (payload, done) => {
    done(null, payload)
  }))
}
