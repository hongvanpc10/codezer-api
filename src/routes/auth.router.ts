import express from 'express'
import { authController } from '../controllers'

const authRouter = express.Router()

authRouter.post('/register', authController.register)

export default authRouter
