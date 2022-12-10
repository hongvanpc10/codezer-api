import { Request, Response } from 'express'
import mongoose from 'mongoose'
import Blog from '../models/blog.model'

export const create = async (req: Request, res: Response) => {
	try {
		const { title, description, content, thumb, categories } = req.body

		const blog = new Blog({
			title,
			description,
			content,
			thumb,
			categories,
			author: '639450d5bd726e3cdc5ac7ae',
		})

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

export const getBlogsGroupByCategory = async (req: Request, res: Response) => {
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

export const getBlog = async (req: Request, res: Response) => {
	try {
		const blog = await Blog.findById(req.params.id).populate(
			'author categories likes',
			'-password'
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

export const getBlogs = async (req: Request, res: Response) => {
	try {
		const limit = Number(req.query.limit) || 6
		const sort = req.query.sort || 'createdAt'
		const order = Number(req.query.order) || 'dsd'
		const page = Number(req.query.page) || 1

		const blogs = await Blog.aggregate([
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
								[sort as string]: order === 'dsd' ? -1 : 1,
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
		return res.json({ message: 'Get blogs successfully', data: blogs[0] })
	} catch (error: any) {
		return res.status(500).json({
			message: error.message,
			error,
			errorCode: 'bga5001',
		})
	}
}

export const getBlogsByCategory = async (req: Request, res: Response) => {
	try {
		const limit = Number(req.query.limit) || 6
		const sort = req.query.sort || 'createdAt'
		const order = Number(req.query.order) || 'dsd'
		const page = Number(req.query.page) || 1

		const blogs = await Blog.aggregate([
			{
				$facet: {
					blogs: [
						{
							$match: {
								categories: new mongoose.Types.ObjectId(
									req.params.id
								),
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
											password: 0,
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
								[sort as string]: order === 'dsd' ? -1 : 1,
							},
						},

						{
							$skip: (page - 1) * limit,
						},

						{
							$limit: limit,
						},
					],

					total: [
						{
							$match: {
								categories: new mongoose.Types.ObjectId(
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

		return res.json({ message: 'Get blogs successfully', data: blogs[0] })
	} catch (error: any) {
		return res.status(500).json({
			message: error.message,
			error,
			errorCode: 'bbc5001',
		})
	}
}

export const getBlogsByUser = async (req: Request, res: Response) => {
	try {
		const limit = Number(req.query.limit) || 6
		const sort = req.query.sort || 'createdAt'
		const order = Number(req.query.order) || 'dsd'
		const page = Number(req.query.page) || 1

		const blogs = await Blog.aggregate([
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
							$lookup: {
								from: 'users',
								localField: 'author',
								foreignField: '_id',
								as: 'author',
								pipeline: [
									{
										$project: {
											password: 0,
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
								[sort as string]: order === 'dsd' ? -1 : 1,
							},
						},
						{
							$skip: (page - 1) * limit,
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

		return res.json({ message: 'Get blogs successfully', data: blogs[0] })
	} catch (error: any) {
		return res.status(500).json({
			message: error.message,
			error,
			errorCode: 'bbu5001',
		})
	}
}

export const update = async (req: Request, res: Response) => {
	try {
		const { title, thumb, description, content, categories } = req.body

		const blog = await Blog.findByIdAndUpdate(
			req.params.id,
			{ title, description, content, thumb, categories },
			{ new: true }
		)

		return res.json({ message: 'Update blog successfully', data: blog })
	} catch (error: any) {
		return res.status(500).json({
			message: error.message,
			error,
			errorCode: 'bup5001',
		})
	}
}

export const _delete = async (req: Request, res: Response) => {
	try {
		await Blog.findByIdAndDelete(req.params.id)

		return res.json({ message: 'Delete blog successfully' })
	} catch (error: any) {
		return res.status(500).json({
			message: error.message,
			error,
			errorCode: 'bdl5001',
		})
	}
}

export const like = async (req: Request, res: Response) => {
	try {
		const blog = await Blog.findByIdAndUpdate(
			req.params.id,
			{
				$push: { likes: '63931241f799eb95abd4b604' },
			},
			{ new: true }
		)

		return res.json({ message: 'Like blog successfully', data: blog })
	} catch (error: any) {
		return res.status(500).json({
			message: error.message,
			error,
			errorCode: 'blk5001',
		})
	}
}

export const unlike = async (req: Request, res: Response) => {
	try {
		const blog = await Blog.findByIdAndUpdate(
			req.params.id,
			{
				$pull: { likes: '63931241f799eb95abd4b604' },
			},
			{ new: true }
		)

		return res.json({ message: 'Unlike blog successfully', data: blog })
	} catch (error: any) {
		return res.status(500).json({
			message: error.message,
			error,
			errorCode: 'blk5001',
		})
	}
}
