import express from 'express'
import { blogsController } from '~/controllers'
import admin from '~/middleware/admin'
import auth from '~/middleware/auth'

const blogsRouter = express.Router()

blogsRouter.post('/', auth, blogsController.create)

blogsRouter.get('/', blogsController.getBlogs)
blogsRouter.get('/pinned', blogsController.getPinnedBlogs)
blogsRouter.get('/categories', blogsController.getBlogsGroupByCategory)
blogsRouter.get('/category/:id', blogsController.getBlogsByCategory)
blogsRouter.get('/user/:id', blogsController.getBlogsByUser)
blogsRouter.get('/saved', auth, blogsController.getSavedBlogs)
blogsRouter.get('/followings', auth, blogsController.getFollowingsBlogs)
blogsRouter.get('/liked', auth, blogsController.getLikedBlogs)
blogsRouter.get('/:id/like', auth, blogsController.like)
blogsRouter.get('/:id/pin', [auth, admin], blogsController.pin)
blogsRouter.get('/:id/unpin', [auth, admin], blogsController.unpin)
blogsRouter.get('/:id/unlike', auth, blogsController.unlike)
blogsRouter.get('/:id/save', auth, blogsController.save)
blogsRouter.get('/:id/unsave', auth, blogsController.unsave)
blogsRouter.get('/:id', blogsController.getBlog)

blogsRouter.patch('/:id', auth, blogsController.update)

blogsRouter.delete('/:id', auth, blogsController._delete)

export default blogsRouter
