import type { Task } from '@prisma/client'
import type TasksRepository from '../repositories/tasks.repository'
import type CommentsRepository from '../repositories/comments.repository'
import type UsersRepository from '../repositories/users.repository'
import { taskSchema, updateTaskSchema } from '../models/task.model'
import { commentSchema } from '../models/comment.model'
import { InvalidDataException, NotFoundException } from '../utils/errors'

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

    return await this.tasksRepository.create(result.data)
  }

  async get (): Promise<Task[] | null> {
    return await this.tasksRepository.get()
  }

  async getById (taskId: string): Promise<Task | null> {
    const task = await this.tasksRepository.getById(+taskId)
    if (!task) {
      throw new NotFoundException('Task not found')
    }
    return task
  }

  async update (taskId: string, task: unknown): Promise<Task | null> {
    if (!task || Object.keys(task).length === 0) {
      throw new InvalidDataException('Missing task data')
    }

    const result = updateTaskSchema.safeParse(task)
    if (!result.success) {
      const errors = result.error.errors.map((err) => { return err.message })
      throw new InvalidDataException(`Invalid task data: [${errors.toString()}]`)
    }

    const taskExists = await this.tasksRepository.getById(+taskId)
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

  async delete (taskId: string): Promise<Task | null> {
    const task = await this.tasksRepository.getById(+taskId)
    if (!task) {
      throw new NotFoundException('Task not found')
    }
    return await this.tasksRepository.delete(+taskId)
  }

  async addComment (taskId: string, content: string, createdBy: number): Promise<Task | null> {
    const task = await this.tasksRepository.getById(+taskId)
    if (!task) {
      throw new NotFoundException('Task not found')
    }

    const result = commentSchema.safeParse({ content, taskId: Number(taskId), createdBy })
    if (!result.success) {
      console.log(result.error)

      const errors = result.error.errors.map((err) => { return err.message })
      throw new InvalidDataException(`Invalid comment data: [${errors.toString()}]`)
    }

    await this.commentsRepository.create(result.data)
    return await this.tasksRepository.getById(+taskId)
  }

  async deleteComment (taskId: string, commentId: string): Promise<Task | null> {
    const task = await this.tasksRepository.getById(+taskId)
    if (!task) {
      throw new NotFoundException('Task not found')
    }

    const result = await this.commentsRepository.delete(+commentId)
    if (!result) {
      throw new NotFoundException('Comment not found')
    }

    return await this.tasksRepository.getById(+taskId)
  }
}
