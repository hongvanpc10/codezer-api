import { Request, Response } from 'express'
import User from '~/models/user.model'

export default async function getTopUsers(req: Request, res: Response) {
	try {
		const users = await User.find({ role: 'user' })
			.select('-password -savedBlogs')
			.sort('scores')
			.limit(5)

		return res.json({
			message: 'Get users successfully',
			data: users,
		})
	} catch (error: any) {
		return res.status(500).json({
			message: error.message,
			error,
			errorCode: 'utu5001',
		})
	}
}
