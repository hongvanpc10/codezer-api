import express from 'express'
import { usersController } from '~/controllers'
import admin from '~/middleware/admin'
import auth from '~/middleware/auth'

const usersRouter = express.Router()

usersRouter.patch('/', auth, usersController.update)
usersRouter.patch('/change-password', auth, usersController.changePassword)

usersRouter.get('/:id/topfan', [auth, admin], usersController.setTopFan)
usersRouter.get('/:id/verify', [auth, admin], usersController.verify)
usersRouter.get('/top', usersController.getTopUser)
usersRouter.get('/:id/follow', auth, usersController.follow)
usersRouter.get('/:id/unfollow', auth, usersController.unfollow)
usersRouter.get('/:id', usersController.get)

export default usersRouter
