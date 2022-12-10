import { Request, Response } from 'express'
import Category from '../models/category.model'

export const create = async (req: Request, res: Response) => {
	try {
		const { name, description } = req.body

		const category = new Category({
			name,
			description,
		})

		await category.save()

		res.json({ message: 'Create category successfully', data: category })
	} catch (error: any) {
		if (error.code === 11000)
			return res.status(400).json({
				message: 'Category name already exist',
				errorCode: 'ccr4001',
			})

		return res.status(500).json({
			message: error.message,
			error,
			errorCode: 'ccr5001',
		})
	}
}

export const update = async (req: Request, res: Response) => {
	try {
		const { name, description } = req.body

		const category = await Category.findByIdAndUpdate(
			req.params.id,
			{ name, description },
			{ new: true }
		)

		res.json({ message: 'Update category successfully', data: category })
	} catch (error: any) {
		if (error.code === 11000)
			return res.status(400).json({
				message: 'Category name already exist',
				errorCode: 'ccr4001',
			})

		if (error.kind === 'ObjectId')
			return res.status(400).json({
				message: 'Id invalid',
				errorCode: 'ccr4002',
			})

		return res.status(500).json({
			message: error.message,
			error,
			errorCode: 'ccr5001',
		})
	}
}

export const _delete = async (req: Request, res: Response) => {
	try {
		await Category.findByIdAndDelete(req.params.id)

		res.json({ message: 'Delete category successfully' })
	} catch (error: any) {
		if (error.kind === 'ObjectId')
			return res.status(400).json({
				message: 'Id invalid',
				errorCode: 'ccr4002',
			})

		return res.status(500).json({
			message: error.message,
			error,
			errorCode: 'ccr5001',
		})
	}
}

export const get = async (req: Request, res: Response) => {
	try {
		const category = await Category.find()

		res.json({ message: 'Get category successfully', data: category })
	} catch (error: any) {
		return res.status(500).json({
			message: error.message,
			error,
			errorCode: 'ccr5001',
		})
	}
}
