import { Request, Response } from 'express'
import Blog from '~/models/blog.model'

export default async function getBlog(req: Request, res: Response) {
	try {
		const blog = await Blog.findOneAndUpdate(
			{ slug: req.params.slug },
			{ $inc: { views: 1 } }
		).populate(
			'author categories',
			'fullName slug avatar isTopFan isVerified role name'
		)

		if (!blog)
			return res
				.status(404)
				.json({ message: 'Blog not found', errorCode: 'bgo4001' })

		return res.json({ message: 'Get blog successfully', data: blog })
	} catch (error: any) {
		return res.status(500).json({
			message: error.message,
			error,
			errorCode: 'bgo5001',
		})
	}
}
