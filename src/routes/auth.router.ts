import express from 'express'
import { authController } from '../controllers'

const authRouter = express.Router()

authRouter.post('/', authController.login)

export default authRouter
