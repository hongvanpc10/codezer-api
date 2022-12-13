import { Request, Response } from 'express'
import mongoose from 'mongoose'
import Blog from '~/models/blog.model'
import paginate from '~/utils/paginate'

export default async function getBlogsByUser(req: Request, res: Response) {
	try {
		const { limit, page, skip, sort } = paginate(req)

		const data = await Blog.aggregate([
			{
				$facet: {
					blogs: [
						{
							$match: {
								author: new mongoose.Types.ObjectId(
									req.params.id
								),
							},
						},

						{
							$project: {
								title: 1,
								views: 1,
								thumb: 1,
								slug: 1,
								createdAt: 1,
								description: 1,
								author: 1,
								categories: 1,
								likesCount: {
									$size: '$likes',
								},
							},
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

					total: [
						{
							$match: {
								author: new mongoose.Types.ObjectId(
									req.params.id
								),
							},
						},

						{ $count: 'count' },
					],
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
			errorCode: 'bbu5001',
		})
	}
}
