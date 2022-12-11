import { Request, Response } from 'express'
import Blog from '~/models/blog.model'

export default async function getPinnedBlogs(req: Request, res: Response) {
	try {
		const blogs = await Blog.find({ isPinned: true })
			.populate('author categories', '-password -savedBlogs')
			.sort('-createdAt')
			.limit(6)

		return res.json({ message: 'Get blogs successfully', data: blogs })
	} catch (error: any) {
		return res.status(500).json({
			message: error.message,
			error,
			errorCode: 'bpb5001',
		})
	}
}
