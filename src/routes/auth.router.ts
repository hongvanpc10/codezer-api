import express from 'express'
import * as authController from '~/controllers/auth'

const authRouter = express.Router()

authRouter.post('/register', authController.register)
authRouter.post('/active', authController.active)
authRouter.post('/login/google', authController.googleLogin)
authRouter.post('/login/facebook', authController.facebookLogin)
authRouter.post('/login', authController.login)

authRouter.get('/logout', authController.logout)
authRouter.get('/refresh-token', authController.refreshToken)

export default authRouter
