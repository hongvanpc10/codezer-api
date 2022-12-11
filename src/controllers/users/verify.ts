import { Request, Response } from 'express'
import User from '~/models/user.model'

export default async function verify(req: Request, res: Response) {
	try {
		const user = await User.findByIdAndUpdate(
			req.params.id,
			{
				isVerified: true,
			},
			{ new: true }
		)

		return res.json({ message: 'User is verified', data: user })
	} catch (error: any) {
		return res.status(500).json({
			message: error.message,
			error,
			errorCode: 'uvr5001',
		})
	}
}
