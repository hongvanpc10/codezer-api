import { Request, Response } from 'express'
import Blog from '~/models/blog.model'

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
