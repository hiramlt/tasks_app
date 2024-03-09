import path from 'path'
import url from 'url'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import config from '../config/config'
import type { User } from '@prisma/client'
import type { ReqUser } from '../types'

const filename = url.fileURLToPath(import.meta.url)
export const dirname = path.dirname(filename)

export const createHash = (password: string): string => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10))
}

export const isValidPassword = (password: string, userPassword: string): boolean => {
  return bcrypt.compareSync(password, userPassword)
}

export const createToken = (user: User): string => {
  const payload = { id: user.id, name: user.name, email: user.email }
  return jwt.sign(payload, config.jwtSecret, { expiresIn: '15m' })
}

export const validateToken = async (token: string): Promise<boolean | jwt.JwtPayload | string | undefined> => {
  return await new Promise((resolve) => {
    jwt.verify(token, config.jwtSecret, (error, payload) => {
      if (error) {
        resolve(false)
        return
      }
      resolve(payload)
    })
  })
}

export const isReqUser = (obj: any): obj is ReqUser => {
  return 'id' in obj && 'name' in obj && 'email' in obj
}
