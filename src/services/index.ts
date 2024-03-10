import { tasksRepository, usersRepository, commentsRepository } from '../repositories/index'
import TasksService from './tasks.service'
import UsersService from './users.service'

export const tasksService = new TasksService(tasksRepository, commentsRepository, usersRepository)
export const usersService = new UsersService(usersRepository)
