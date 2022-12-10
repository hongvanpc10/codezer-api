import express from 'express'
import { categoriesController } from '../controllers'

const categoriesRouter = express.Router()

categoriesRouter.get('/', categoriesController.get)
categoriesRouter.post('/', categoriesController.create)
categoriesRouter.patch('/:id', categoriesController.update)
categoriesRouter.delete('/:id', categoriesController._delete)

export default categoriesRouter
