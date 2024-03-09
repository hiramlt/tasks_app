import { prisma } from '../db'
import TasksRepository from './tasks.repository'
import UsersRepository from './users.repository'
import CommentsRepository from './comments.repository'

export const tasksRepository = new TasksRepository(prisma)
export const usersRepository = new UsersRepository(prisma)
export const commentsRepository = new CommentsRepository(prisma)
