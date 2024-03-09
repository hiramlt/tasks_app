import { z } from 'zod'

export const taskSchema = z.object({
  title: z.string({
    required_error: 'title is required',
    invalid_type_error: 'title must be a string'
  }).min(1, { message: 'title is required' }),
  description: z.string({
    required_error: 'description is required',
    invalid_type_error: 'description must be a string'
  }).min(1, { message: 'description is required' }),
  status: z.enum(['Pending', 'In process', 'Completed', 'Testing', 'Accepted'],
    { errorMap: (_issue, _ctx) => ({ message: 'Invalid status value' }) }
  ).default('Pending'),
  dueDate: z.coerce.date({
    required_error: 'dueDate value is required',
    invalid_type_error: 'Invalid date'
  }),
  responsibleId: z.number({
    required_error: 'responsibleId is required',
    invalid_type_error: 'responsibleId must be a numeric value'
  }).int({ message: 'responsibleId must be an integer' })
    .nonnegative({ message: 'responsibleId must be a positive value' }),
  file: z.string().optional(),
  isPublic: z.boolean({ invalid_type_error: 'isPubic must be a boolean' }).optional(),
  createdBy: z.number().int({ message: 'createdBy is required' })
    .nonnegative({ message: 'responsibleId must be a positive value' })
})

export const updateTaskSchema = z.object({
  title: z.string({ invalid_type_error: 'title must be a string' }).optional(),
  description: z.string({ invalid_type_error: 'description must be a string' }).optional(),
  status: z.enum(['Pending', 'In process', 'Completed', 'Testing', 'Accepted']).optional(),
  dueDate: z.coerce.date({ invalid_type_error: 'invalid date' }).optional(),
  responsibleId: z.number({ invalid_type_error: 'responsibleId must be a numeric value' })
    .int({ message: 'responsibleId  must be an integer' })
    .nonnegative({ message: 'responsibleId must be a positive value' }).optional(),
  file: z.string().optional(),
  isPublic: z.boolean().optional()
})
