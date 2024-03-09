import type { PrismaClient, Comment } from '@prisma/client'
import { type CreateCommentInput } from '../types'

export default class CommentsRepository {
  constructor (private readonly prismaClient: PrismaClient) {
    this.prismaClient = prismaClient
  }

  async create (comment: CreateCommentInput): Promise<Comment | null> {
    return await this.prismaClient.comment.create({ data: comment })
  }

  async update (commentId: number, comment: string): Promise<Comment | null> {
    return await this.prismaClient.comment.update({ where: { id: commentId }, data: { content: comment } })
  }

  async delete (commentId: number): Promise<Comment | null> {
    return await this.prismaClient.comment.delete({ where: { id: commentId } })
  }
}
