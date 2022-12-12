import express from 'express'
import * as usersController from '~/controllers/users'
import admin from '~/middleware/admin'
import auth from '~/middleware/auth'

const usersRouter = express.Router()

usersRouter.patch('/', auth, usersController.update)
usersRouter.patch('/change-password', auth, usersController.changePassword)

usersRouter.get('/:id/topfan', [auth, admin], usersController.setTopFan)
usersRouter.get('/:id/verify', [auth, admin], usersController.verify)
usersRouter.get('/top', usersController.getTopUsers)
usersRouter.get('/:id/follow', auth, usersController.follow)
usersRouter.get('/:id/unfollow', auth, usersController.unfollow)
usersRouter.get('/:slug', usersController.get)

export default usersRouter
