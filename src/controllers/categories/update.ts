import { Request, Response } from 'express'
import Category from '~/models/category.model'

export default async function update(req: Request, res: Response) {
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
