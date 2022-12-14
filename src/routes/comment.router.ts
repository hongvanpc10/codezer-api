import express from 'express'
import * as commentsController from '~/controllers/comments'
import auth from '~/middleware/auth'

const commentsRouter = express.Router()

commentsRouter.post('/', auth, commentsController.create)

export default commentsRouter
