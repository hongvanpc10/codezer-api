import { Request, Response } from 'express'
import Blog from '~/models/blog.model'

export default async function getBlog(req: Request, res: Response) {
	try {
		const blog = await Blog.findById(req.params.id).populate(
			'author categories likes',
			'-password -savedBlogs'
		)

		return res.json({ message: 'Get blog successfully', data: blog })
	} catch (error: any) {
		return res.status(500).json({
			message: error.message,
			error,
			errorCode: 'bgo5001',
		})
	}
}
