import express from 'express'
import { usersController } from '../controllers'
import admin from '../middleware/admin'
import auth from '../middleware/auth'

const usersRouter = express.Router()

usersRouter.patch('/', auth, usersController.update)

usersRouter.get('/:id/topfan', [auth, admin], usersController.setTopFan)
usersRouter.get('/:id/verify', [auth, admin], usersController.verify)

export default usersRouter
