import { Request, Response } from 'express'
import Category from '~/models/category.model'

export default async function _delete(req: Request, res: Response) {
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
