import express from 'express'
import path from 'path'
import morgan from 'morgan'
import passport from 'passport'
import cookieParser from 'cookie-parser'
import config from './config/config'
import { dirname } from './utils/utils'
import { errorHandler } from './utils/errorhandler'
import { initPassport } from './config/passport.config'

import tasksRouter from './routers/tasks.router'
import authRouter from './routers/auth.router'

const app = express()

initPassport()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser(config.cookieSecret))
app.use(passport.initialize())
app.use(express.static(path.join(dirname, '../public')))
app.use(morgan('dev'))

app.use('/api/tasks', tasksRouter)
app.use('/api/auth', authRouter)
app.use(errorHandler)

export default app
