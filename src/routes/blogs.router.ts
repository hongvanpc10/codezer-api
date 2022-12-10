import express from 'express'
import { blogsController } from '../controllers'

const blogsRouter = express.Router()

blogsRouter.post('/', blogsController.create)

blogsRouter.get('/', blogsController.getBlogs)
blogsRouter.get('/categories', blogsController.getBlogsGroupByCategory)
blogsRouter.get('/category/:id', blogsController.getBlogsByCategory)
blogsRouter.get('/user/:id', blogsController.getBlogsByUser)
blogsRouter.get('/:id', blogsController.getBlog)

blogsRouter.patch('/:id/like', blogsController.like)
blogsRouter.patch('/:id/unlike', blogsController.unlike)
blogsRouter.patch('/:id', blogsController.update)

blogsRouter.delete('/:id', blogsController._delete)

export default blogsRouter
