import { Request, Response } from 'express'
import Blog from '~/models/blog.model'

export default async function getBlogs(req: Request, res: Response) {
	try {
		const limit = Number(req.query.limit) || 6
		const sort = req.query.sort || 'createdAt'
		const order = Number(req.query.order) || -1
		const page = Number(req.query.page) || 1

		const data = await Blog.aggregate([
			{
				$facet: {
					blogs: [
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
							$sort: {
								[sort as string]: <1 | -1>order,
							},
						},

						{
							$skip: (page - 1) * limit,
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
