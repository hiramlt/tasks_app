import { z } from 'zod'

export const commentSchema = z.object({
  content: z.string({
    required_error: 'content is required',
    invalid_type_error: 'content must be a string'
  }).min(1, { message: 'content is required' }),
  taskId: z.number({
    required_error: 'taskId is required',
    invalid_type_error: 'taskId must e a numeric value'
  }).int({ message: 'taskId must be an integer' })
    .nonnegative({ message: 'taskId must be a positive value' }),
  createdBy: z.number({
    required_error: 'createdBy is required',
    invalid_type_error: 'createdBy must be a numeric value'
  }).int({ message: 'createdBy must be an integer' })
    .nonnegative({ message: 'taskId must be a positive value' })
})
