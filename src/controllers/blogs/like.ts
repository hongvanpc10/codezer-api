import { Response } from 'express'
import { RequestWithAuth } from '~/middleware/auth'
import Blog from '~/models/blog.model'

export const like = async (req: RequestWithAuth, res: Response) => {
	try {
		const blog = await Blog.findByIdAndUpdate(
			req.params.id,
			{
				$addToSet: { likes: req.user._id },
			},
			{ new: true }
		).populate('author categories', '-password -savedBlogs')

		return res.json({ message: 'Like blog successfully', data: blog })
	} catch (error: any) {
		return res.status(500).json({
			message: error.message,
			error,
			errorCode: 'blk5001',
		})
	}
}

export const unlike = async (req: RequestWithAuth, res: Response) => {
	try {
		const blog = await Blog.findByIdAndUpdate(
			req.params.id,
			{
				$pull: { likes: req.user._id },
			},
			{ new: true }
		).populate('author categories', '-password -savedBlogs')

		return res.json({ message: 'Unlike blog successfully', data: blog })
	} catch (error: any) {
		return res.status(500).json({
			message: error.message,
			error,
			errorCode: 'blk5001',
		})
	}
}
