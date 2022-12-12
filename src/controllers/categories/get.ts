import { Request, Response } from 'express'
import Category from '~/models/category.model'

export default async function get(req: Request, res: Response) {
	try {
		const category = await Category.find().sort('name')

		res.json({ message: 'Get category successfully', data: category })
	} catch (error: any) {
		return res.status(500).json({
			message: error.message,
			error,
			errorCode: 'ccr5001',
		})
	}
}
