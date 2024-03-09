import { z } from 'zod'

export const userSchema = z.object({
  name: z.string({
    required_error: 'Name is required',
    invalid_type_error: 'Name must be a string'
  }).min(1, { message: 'Name is required' }),
  email: z.string({
    invalid_type_error: 'Email must be a string',
    required_error: 'Email is required'
  }).email({ message: 'Invalid email' })
    .min(1, { message: 'Email is required' }),
  password: z.string({
    invalid_type_error: 'Password must be a string',
    required_error: 'Password is required'
  }).min(8)
})
