import type { PrismaClient, Task } from '@prisma/client'
import type { UpdateTaskInput, CreateTaskInput } from '../types'

export default class TasksRepository {
  constructor (private readonly prismaClient: PrismaClient) {
    this.prismaClient = prismaClient
  }

  async create (task: CreateTaskInput): Promise<Task | null> {
    return await this.prismaClient.task.create({
      data: task,
      include: {
        comments:
        { select: { id: true, content: true, createdBy: true, createdAt: true } }
      }
    })
  }

  async get (): Promise<Task[] | null> {
    return await this.prismaClient.task.findMany({
      where: { isPublic: true },
      include: {
        comments:
        { select: { id: true, content: true, createdBy: true, createdAt: true } }
      }
    })
  }

  async getById (taskId: number): Promise<Task | null> {
    return await this.prismaClient.task.findUnique({
      where: { id: taskId, AND: { isPublic: true } },
      include: {
        comments:
        { select: { id: true, content: true, createdBy: true, createdAt: true } }
      }
    })
  }

  async update (taskId: number, task: UpdateTaskInput): Promise<Task | null> {
    return await this.prismaClient.task.update({
      where: { id: taskId },
      data: task,
      include: {
        comments:
        { select: { id: true, content: true, createdBy: true, createdAt: true } }
      }
    })
  }

  async delete (taskId: number): Promise<Task | null > {
    return await this.prismaClient.task.delete({ where: { id: taskId } })
  }
}
