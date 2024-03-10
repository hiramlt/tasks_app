import { Router } from 'express'
import { usersController } from '../controllers/index'
import { authMiddleware } from '../utils/middlewares'

const router = Router()

router.post('/register', usersController.create)
router.post('/login', usersController.login)
router.get('/profile', authMiddleware, usersController.getProfile)

export default router
