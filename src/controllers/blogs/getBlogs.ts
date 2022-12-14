import { Request, Response } from 'express'
import Blog from '~/models/blog.model'
import paginate from '~/utils/paginate'

export default async function getBlogs(req: Request, res: Response) {
	try {
		const { limit, page, sort, skip } = paginate(req)

		const data = await Blog.aggregate([
			{
				$facet: {
					blogs: [
						{
							$project: {
								title: 1,
								views: 1,
								thumb: 1,
								slug: 1,
								createdAt: 1,
								author: 1,
								categories: 1,
								likesCount: {
									$size: '$likes',
								},
								description: 1,
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
											fullName: 1,
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
							$sort: sort,
						},

						{
							$skip: skip,
						},

						{
							$limit: limit,
						},
					],

					total: [{ $count: 'count' }],
				},
			},

			{
				$project: {
					blogs: 1,
					total: { $arrayElemAt: ['$total.count', 0] },
				},
			},
		])

		const totalPages = Math.ceil(data[0].total / limit)

		return res.json({
			message: 'Get blogs successfully',
			data: {
				...data[0],
				pagination: {
					totalPages,
					currentPage: page,
					itemsPerPage: limit,
				},
			},
		})
	} catch (error: any) {
		return res.status(500).json({
			message: error.message,
			error,
			errorCode: 'bga5001',
		})
	}
}
