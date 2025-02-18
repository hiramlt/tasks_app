import type { Request, Response, NextFunction } from 'express'
import type TasksService from '../services/tasks.service'
import { isReqUser } from '../utils/utils'

export default class TasksController {
  constructor (private readonly tasksService: TasksService) {
    this.tasksService = tasksService
  }

  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (isReqUser(req.user)) {
        const task = await this.tasksService.create({ createdBy: req.user.id, ...req.body, file: req.file?.filename })
        res.status(201).json(task)
      }
    } catch (error) {
      next(error)
    }
  }

  get = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (isReqUser(req.user)) {
        const tasks = await this.tasksService.get(req.user.id)
        res.status(200).json(tasks)
      }
    } catch (error) {
      next(error)
    }
  }

  getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { id } = req.params
    try {
      if (isReqUser(req.user)) {
        const task = await this.tasksService.getById(id, req.user.id)
        res.status(200).json(task)
      }
    } catch (error) {
      next(error)
    }
  }

  update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { id } = req.params
    try {
      if (isReqUser(req.user)) {
        const updatedTask = await this.tasksService.update(id, req.body, req.user.id)
        res.status(200).json(updatedTask)
      }
    } catch (error) {
      next(error)
    }
  }

  delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { id } = req.params
    try {
      if (isReqUser(req.user)) {
        await this.tasksService.delete(id, req.user.id)
        res.status(204).end()
      }
    } catch (error) {
      next(error)
    }
  }

  addComment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { id } = req.params
    const { content }: { content: string } = req.body
    try {
      if (isReqUser(req.user)) {
        const task = await this.tasksService.addComment(id, content, req.user.id)
        res.status(200).json(task)
      }
    } catch (error) {
      next(error)
    }
  }

  deleteComment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { id, cid } = req.params
    try {
      if (isReqUser(req.user)) {
        const task = await this.tasksService.deleteComment(id, cid, req.user.id)
        res.status(200).json(task)
      }
    } catch (error) {
      next(error)
    }
  }
}
