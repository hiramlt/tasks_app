import type UsersRepository from '../repositories/users.repository'
import type { User } from '@prisma/client'
import { userSchema } from '../models/user.model'
import { InvalidDataException, NotFoundException } from '../utils/errors'
import { createHash, isValidPassword, createToken } from '../utils/utils'

export default class UsersService {
  constructor (private readonly usersRepository: UsersRepository) {
    this.usersRepository = usersRepository
  }

  async create (user: unknown): Promise<User | null> {
    const result = userSchema.safeParse(user)
    if (!result.success) {
      const errors = result.error.errors.map((err) => { return err.message })
      throw new InvalidDataException(`Invalid user data: [${errors.toString()}]`)
    }

    const userExists = await this.usersRepository.getByEmail(result.data.email)
    if (userExists) {
      throw new InvalidDataException('User already exists')
    }

    result.data.password = createHash(result.data.password)
    return await this.usersRepository.create(result.data)
  }

  async login (email: string, password: string): Promise<string | null> {
    const user = await this.usersRepository.getByEmail(email)
    if (user && isValidPassword(password, user.password)) {
      const token = createToken(user)
      return token
    }
    throw new InvalidDataException('Invalid credentials')
  }

  async getById (id: string): Promise<User | null> {
    const user = await this.usersRepository.getById(+id)
    if (!user) {
      throw new NotFoundException('User not found')
    }
    return user
  }

  async getByEmail (email: string): Promise<User | null> {
    const user = await this.usersRepository.getByEmail(email)
    if (!user) {
      throw new NotFoundException('User not found')
    }
    return user
  }
}
