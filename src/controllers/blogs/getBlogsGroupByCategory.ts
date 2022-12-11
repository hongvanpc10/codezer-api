import { Request, Response } from 'express'
import Blog from '~/models/blog.model'

export default async function getBlogsGroupByCategory(
	req: Request,
	res: Response
) {
	try {
		const data = await Blog.aggregate([
			{
				$lookup: {
					from: 'users',
					localField: 'author',
					foreignField: '_id',
					as: 'author',
					pipeline: [
						{
							$project: {
								password: 0,
								savedBlogs: 0,
							},
						},
					],
				},
			},

			{
				$unwind: '$author',
			},

			{
				$lookup: {
					from: 'categories',
					localField: 'categories',
					foreignField: '_id',
					as: 'categories',
				},
			},

			{
				$unwind: '$categories',
			},

			{ $sort: { createdAt: -1 } },

			{
				$group: {
					_id: '$categories._id',
					name: {
						$first: '$categories.name',
					},
					slug: {
						$first: '$categories.slug',
					},
					blogs: {
						$push: '$$ROOT',
					},
					total: {
						$sum: 1,
					},
				},
			},

			{
				$project: {
					blogs: {
						$slice: ['$blogs', 1],
					},
					total: 1,
					name: 1,
					slug: 1,
				},
			},
		])

		return res.json({ message: 'Get blogs successfully', data })
	} catch (error: any) {
		return res.status(500).json({
			message: error.message,
			error,
			errorCode: 'bgc5001',
		})
	}
}
