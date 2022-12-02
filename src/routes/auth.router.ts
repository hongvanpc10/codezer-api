import express from 'express'
import { authController } from '../controllers'

const authRouter = express.Router()

authRouter.post('/register', authController.register)
authRouter.post('/active', authController.active)

export default authRouter
