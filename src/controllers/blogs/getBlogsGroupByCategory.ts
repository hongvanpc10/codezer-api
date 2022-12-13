import { Request, Response } from 'express'
import Blog from '~/models/blog.model'

export default async function getBlogsGroupByCategory(
	req: Request,
	res: Response
) {
	try {
		const data = await Blog.aggregate([
			{
				$project: {
					title: 1,
					views: 1,
					thumb: 1,
					slug: 1,
					createdAt: 1,
					author: 1,
					description: 1,
					categories: 1,
					likesCount: {
						$size: '$likes',
					},
				},
			},

			{
				$lookup: {
					from: 'users',
					localField: 'author',
					foreignField: '_id',
					as: 'author',
					pipeline: [
						{
							$project: {
								firstName: 1,
								lastName: 1,
								slug: 1,
								avatar: 1,
								isTopFan: 1,
								isVerified: 1,
								role: 1,
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
