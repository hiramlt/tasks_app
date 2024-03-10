import path from 'path'
import url from 'url'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import multer from 'multer'
import config from '../config/config'
import type { Request } from 'express'
import type { User } from '@prisma/client'
import type { ReqUser, DestinationCallback, FileNameCallback } from '../types'
import { InvalidDataException } from './errors'
// import { InvalidDataException } from './errors'

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

const allowedFilesMimeTypes = [
  'image/jpeg',
  'image/png',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
]

export const uploadFile = multer({
  storage: multer.diskStorage({
    destination: function (req: Request, file: Express.Multer.File, cb: DestinationCallback) {
      cb(null, path.join(dirname, '../../public'))
    },
    filename: function (req: Request, file: Express.Multer.File, cb: FileNameCallback) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, uniqueSuffix + '-' + file.originalname)
    }
  }),
  limits: {
    fieldSize: 10000000
  },
  fileFilter: (req: Request, file: Express.Multer.File, cb) => {
    if (allowedFilesMimeTypes.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new InvalidDataException('Invalid file type'))
    }
  }
}).single('file')

export const isReqUser = (obj: any): obj is ReqUser => {
  return 'id' in obj && 'name' in obj && 'email' in obj
}
