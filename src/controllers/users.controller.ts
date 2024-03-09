import type { Request, Response, NextFunction } from 'express'
import type UsersService from '../services/users.service'

export default class UsersController {
  constructor (private readonly usersService: UsersService) {
    this.usersService = usersService
  }

  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = await this.usersService.create(req.body)
      res.status(201).json(user)
    } catch (error) {
      next(error)
    }
  }

  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { email, password }: { email: string, password: string } = req.body
    try {
      const token = await this.usersService.login(email, password)
      res.cookie('access_token', token, { maxAge: 1000 * 60 * 15, httpOnly: true, signed: true })
        .status(200).json({ status: 'ok' })
    } catch (error) {
      next(error)
    }
  }

  getProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      res.status(200).json(req.user)
    } catch (error) {
      next(error)
    }
  }
}
