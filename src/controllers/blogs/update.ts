import { Response } from 'express'
import { RequestWithAuth } from '~/middleware/auth'
import Blog from '~/models/blog.model'

export default async function update(req: RequestWithAuth, res: Response) {
	try {
		if (req.user._id !== req.params.id)
			return res.status(400).json({ message: 'Not author' })

		const { title, thumb, description, content, categories } = req.body

		const blog = await Blog.findByIdAndUpdate(
			req.params.id,
			{ title, description, content, thumb, categories },
			{ new: true }
		).populate('author categories', '-password -savedBlogs')

		return res.json({ message: 'Update blog successfully', data: blog })
	} catch (error: any) {
		return res.status(500).json({
			message: error.message,
			error,
			errorCode: 'bup5001',
		})
	}
}
