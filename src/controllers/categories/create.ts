import { Request, Response } from 'express'
import Category from '~/models/category.model'

export default async function create(req: Request, res: Response) {
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
