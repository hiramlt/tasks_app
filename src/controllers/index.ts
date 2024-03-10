import { tasksService, usersService } from '../services/index'
import TasksController from './tasks.controller'
import UsersController from './users.controller'

export const tasksController = new TasksController(tasksService)
export const usersController = new UsersController(usersService)
