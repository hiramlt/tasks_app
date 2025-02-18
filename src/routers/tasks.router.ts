import { Router } from 'express'
import { tasksController } from '../controllers/index'
import { authMiddleware } from '../utils/middlewares'
import { uploadFile } from '../utils/utils'

const router = Router()

router.use(authMiddleware)

router.post('/', uploadFile, tasksController.create)
router.get('/', tasksController.get)
router.get('/:id', tasksController.getById)
router.put('/:id', tasksController.update)
router.delete('/:id', tasksController.delete)
router.post('/:id/comment', tasksController.addComment)
router.delete('/:id/comment/:cid', tasksController.deleteComment)

export default router
