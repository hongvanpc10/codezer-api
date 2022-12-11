import express from 'express'
import * as categoriesController from '~/controllers/categories'
import admin from '~/middleware/admin'
import auth from '~/middleware/auth'

const categoriesRouter = express.Router()

categoriesRouter.get('/', categoriesController.get)
categoriesRouter.post('/', [auth, admin], categoriesController.create)
categoriesRouter.patch('/:id', [auth, admin], categoriesController.update)
categoriesRouter.delete('/:id', [auth, admin], categoriesController.delete)

export default categoriesRouter
