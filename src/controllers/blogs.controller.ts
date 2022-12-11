import { Request, Response } from 'express'
import mongoose from 'mongoose'
import { RequestWithAuth } from '~/middleware/auth'
import Blog from '~/models/blog.model'
import User from '~/models/user.model'

export const create = async (req: RequestWithAuth, res: Response) => {
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

export const getBlog = async (req: Request, res: Response) => {
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

export const getBlogs = async (req: Request, res: Response) => {
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

export const getBlogsByCategory = async (req: Request, res: Response) => {
	try {
		const limit = Number(req.query.limit) || 6
		const sort = req.query.sort || 'createdAt'
		const order = Number(req.query.order) || 'dsd'
		const page = Number(req.query.page) || 1

		const data = await Blog.aggregate([
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

export const getFollowingsBlogs = async (
	req: RequestWithAuth,
	res: Response
) => {
	try {
		const limit = Number(req.query.limit) || 6
		const sort = req.query.sort || 'createdAt'
		const order = Number(req.query.order) || 'dsd'
		const page = Number(req.query.page) || 1

		const data = await Blog.aggregate([
			{
				$facet: {
					blogs: [
						{
							$match: {
								author: { $in: req.user.followings },
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
								author: { $in: req.user.followings },
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

export const getPinnedBlogs = async (req: Request, res: Response) => {
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

export const update = async (req: RequestWithAuth, res: Response) => {
	try {
		if (req.user._id !== req.params.id)
			return res.status(400).json({ message: 'Not author' })

		const { title, thumb, description, content, categories } = req.body

		const blog = await Blog.findByIdAndUpdate(
			req.params.id,
			{ title, description, content, thumb, categories },
			{ new: true }
		).populate('author categories', '-password -savedBlogs')

		return res.json({ message: 'Update blog successfully', data: blog })
	} catch (error: any) {
		return res.status(500).json({
			message: error.message,
			error,
			errorCode: 'bup5001',
		})
	}
}

export const _delete = async (req: RequestWithAuth, res: Response) => {
	try {
		await Blog.findOneAndDelete({
			_id: req.params.id,
			author: req.user._id,
		})

		await User.findByIdAndUpdate(req.user._id, { $inc: { scores: -8 } })

		return res.json({ message: 'Delete blog successfully' })
	} catch (error: any) {
		return res.status(500).json({
			message: error.message,
			error,
			errorCode: 'bdl5001',
		})
	}
}

export const like = async (req: RequestWithAuth, res: Response) => {
	try {
		const blog = await Blog.findByIdAndUpdate(
			req.params.id,
			{
				$addToSet: { likes: req.user._id },
			},
			{ new: true }
		).populate('author categories', '-password -savedBlogs')

		return res.json({ message: 'Like blog successfully', data: blog })
	} catch (error: any) {
		return res.status(500).json({
			message: error.message,
			error,
			errorCode: 'blk5001',
		})
	}
}

export const unlike = async (req: RequestWithAuth, res: Response) => {
	try {
		const blog = await Blog.findByIdAndUpdate(
			req.params.id,
			{
				$pull: { likes: req.user._id },
			},
			{ new: true }
		).populate('author categories', '-password -savedBlogs')

		return res.json({ message: 'Unlike blog successfully', data: blog })
	} catch (error: any) {
		return res.status(500).json({
			message: error.message,
			error,
			errorCode: 'blk5001',
		})
	}
}

export const pin = async (req: Request, res: Response) => {
	try {
		await Blog.findByIdAndUpdate(req.params.id, {
			isPinned: true,
		})

		return res.json({ message: 'Pin blog successfully' })
	} catch (error: any) {
		return res.status(500).json({
			message: error.message,
			error,
			errorCode: 'bpi5001',
		})
	}
}

export const unpin = async (req: Request, res: Response) => {
	try {
		await Blog.findByIdAndUpdate(req.params.id, {
			isPinned: false,
		})

		return res.json({ message: 'Unpin blog successfully' })
	} catch (error: any) {
		return res.status(500).json({
			message: error.message,
			error,
			errorCode: 'bup5001',
		})
	}
}

export const save = async (req: RequestWithAuth, res: Response) => {
	try {
		await User.findByIdAndUpdate(req.user._id, {
			$addToSet: { savedBlogs: req.params.id },
		})

		return res.json({ message: 'Save blog successfully' })
	} catch (error: any) {
		return res.status(500).json({
			message: error.message,
			error,
			errorCode: 'bsv5001',
		})
	}
}

export const unsave = async (req: RequestWithAuth, res: Response) => {
	try {
		await User.findByIdAndUpdate(req.user._id, {
			$pull: { savedBlogs: req.params.id },
		})

		return res.json({ message: 'Unsave blog successfully' })
	} catch (error: any) {
		return res.status(500).json({
			message: error.message,
			error,
			errorCode: 'bus5001',
		})
	}
}

export const getSavedBlogs = async (req: RequestWithAuth, res: Response) => {
	try {
		const limit = Number(req.query.limit) || 6
		const sort = req.query.sort || 'createdAt'
		const order = Number(req.query.order) || 'dsd'
		const page = Number(req.query.page) || 1

		const data = await Blog.aggregate([
			{
				$facet: {
					blogs: [
						{
							$match: {
								_id: {
									$in: req.user.savedBlogs,
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
			errorCode: 'bus5001',
		})
	}
}

export const getLikedBlogs = async (req: RequestWithAuth, res: Response) => {
	try {
		const limit = Number(req.query.limit) || 6
		const sort = req.query.sort || 'createdAt'
		const order = Number(req.query.order) || 'dsd'
		const page = Number(req.query.page) || 1

		const data = await Blog.aggregate([
			{
				$facet: {
					blogs: [
						{
							$match: {
								likes: req.user._id,
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
								likes: req.user._id,
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
			errorCode: 'bus5001',
		})
	}
}
