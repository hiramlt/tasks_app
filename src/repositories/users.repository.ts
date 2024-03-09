import type { PrismaClient, User } from '@prisma/client'
import { type CreateUserInput } from '../types'

export default class UsersRepository {
  constructor (private readonly prismaClient: PrismaClient) {
    this.prismaClient = prismaClient
  }

  async create (user: CreateUserInput): Promise<User | null> {
    return await this.prismaClient.user.create({ data: user })
  }

  async getById (userId: number): Promise<User | null> {
    return await this.prismaClient.user.findUnique({ where: { id: userId } })
  }

  async getByEmail (userEmail: string): Promise<User | null> {
    return await this.prismaClient.user.findUnique({ where: { email: userEmail } })
  }
}
