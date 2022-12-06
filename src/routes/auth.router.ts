import express from 'express'
import { authController } from '../controllers'

const authRouter = express.Router()

authRouter.post('/register', authController.register)
authRouter.post('/active', authController.active)
authRouter.post('/login', authController.login)

export default authRouter
