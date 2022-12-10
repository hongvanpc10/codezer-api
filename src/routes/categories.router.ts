import express from 'express'
import { categoriesController } from '../controllers'
import admin from '../middleware/admin'
import auth from '../middleware/auth'

const categoriesRouter = express.Router()

categoriesRouter.get('/', [auth, admin], categoriesController.get)
categoriesRouter.post('/', [auth, admin], categoriesController.create)
categoriesRouter.patch('/:id', [auth, admin], categoriesController.update)
categoriesRouter.delete('/:id', [auth, admin], categoriesController._delete)

export default categoriesRouter
