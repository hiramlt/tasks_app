import type { Task } from '@prisma/client'
import type TasksRepository from '../repositories/tasks.repository'
import type CommentsRepository from '../repositories/comments.repository'
import type UsersRepository from '../repositories/users.repository'
import { taskSchema, updateTaskSchema } from '../models/task.model'
import { commentSchema } from '../models/comment.model'
import { InvalidDataException, NotFoundException } from '../utils/errors'
import { unlinkSync } from 'fs'

export default class TasksService {
  constructor (
    private readonly tasksRepository: TasksRepository,
    private readonly commentsRepository: CommentsRepository,
    private readonly usersRepository: UsersRepository
  ) {
    this.tasksRepository = tasksRepository
    this.commentsRepository = commentsRepository
  }

  async create (task: unknown): Promise<Task | null> {
    const result = taskSchema.safeParse(task)
    if (!result.success) {
      const errors = result.error.errors.map((err) => { return err.message })
      throw new InvalidDataException(`Invalid task data: [${errors.toString()}]`)
    }

    const user = await this.usersRepository.getById(result.data.responsibleId)
    if (!user) {
      throw new NotFoundException('Responsible user not found')
    }

    if (result.data.file) {
      result.data.file = '/files/' + result.data.file
    }

    return await this.tasksRepository.create(result.data)
  }

  async get (userId: number): Promise<Task[] | null> {
    return await this.tasksRepository.get(userId)
  }

  async getById (taskId: string, userId: number): Promise<Task | null> {
    const task = await this.tasksRepository.getById(+taskId, userId)
    if (!task) {
      throw new NotFoundException('Task not found')
    }
    return task
  }

  async update (taskId: string, task: unknown, userId: number): Promise<Task | null> {
    if (!task || Object.keys(task).length === 0) {
      throw new InvalidDataException('Missing task data')
    }

    const result = updateTaskSchema.safeParse(task)
    if (!result.success) {
      const errors = result.error.errors.map((err) => { return err.message })
      throw new InvalidDataException(`Invalid task data: [${errors.toString()}]`)
    }

    const taskExists = await this.tasksRepository.getById(+taskId, userId)
    if (!taskExists) {
      throw new NotFoundException('Task not found')
    }

    if (result.data.responsibleId) {
      const user = await this.usersRepository.getById(result.data.responsibleId)
      if (!user) {
        throw new NotFoundException('Responsible user not found')
      }
    }

    return await this.tasksRepository.update(+taskId, result.data)
  }

  async delete (taskId: string, userId: number): Promise<Task | null> {
    const task = await this.tasksRepository.getById(+taskId, userId)
    if (!task) {
      throw new NotFoundException('Task not found')
    }
    if (task.file) {
      const filePath = task.file.replace('/files/', 'public/')
      unlinkSync(filePath)
    }

    return await this.tasksRepository.delete(+taskId)
  }

  async addComment (taskId: string, content: string, userId: number): Promise<Task | null> {
    const task = await this.tasksRepository.getById(+taskId, userId)
    if (!task) {
      throw new NotFoundException('Task not found')
    }

    const result = commentSchema.safeParse({ content, taskId: Number(taskId), createdBy: userId })
    if (!result.success) {
      const errors = result.error.errors.map((err) => { return err.message })
      throw new InvalidDataException(`Invalid comment data: [${errors.toString()}]`)
    }

    await this.commentsRepository.create(result.data)
    return await this.tasksRepository.getById(+taskId, userId)
  }

  async deleteComment (taskId: string, commentId: string, userId: number): Promise<Task | null> {
    const task = await this.tasksRepository.getById(+taskId, userId)
    if (!task) {
      throw new NotFoundException('Task not found')
    }

    const result = await this.commentsRepository.delete(+commentId)
    if (!result) {
      throw new NotFoundException('Comment not found')
    }

    return await this.tasksRepository.getById(+taskId, userId)
  }
}
