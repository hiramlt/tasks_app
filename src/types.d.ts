import type { z } from 'zod'
import type { userSchema } from './models/user.model'
import type { commentSchema } from './models/comment.model'
import type { taskSchema, updateTaskSchema } from './models/task.model'

export type CreateUserInput = z.infer<typeof userSchema>
export type CreateCommentInput = z.infer<typeof commentSchema>
export type CreateTaskInput = z.infer<typeof taskSchema>
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>

export type ReqUser = {
  id: number
  name: string
  email: string
}
