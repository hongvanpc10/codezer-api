import { Response } from 'express'
import { RequestWithAuth } from '~/middleware/auth'
import Blog from '~/models/blog.model'
import User from '~/models/user.model'

export default async function create(req: RequestWithAuth, res: Response) {
	try {
		const { title, description, content, thumb, categories } = req.body

		const blog = new Blog({
			title,
			description,
			content,
			thumb,
			categories,
			author: req.user._id,
		})

		await User.findByIdAndUpdate(req.user._id, { $inc: { scores: 10 } })
		await blog.save()

		return res.json({ message: 'Create blog successfully' })
	} catch (error: any) {
		return res.status(500).json({
			message: error.message,
			error,
			errorCode: 'bcr5001',
		})
	}
}
