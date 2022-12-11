import { Request, Response } from 'express'
import User from '~/models/user.model'

export default async function get  (req: Request, res: Response)  {
	try {
		const user = await User.findById(req.params.id).select(
			'-password -savedBlogs'
		)

		if (!user)
			return res
				.status(404)
				.json({ message: 'User not found', errorCode: 'ugu4001' })

		return res.json({
			message: 'Get user information successfully',
			data: user,
		})
	} catch (error: any) {
		return res.status(500).json({
			message: error.message,
			error,
			errorCode: 'ugu5001',
		})
	}
}
