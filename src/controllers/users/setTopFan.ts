import { Request, Response } from 'express'
import User from '~/models/user.model'

export default async function setTopFan(req: Request, res: Response) {
	try {
		const user = await User.findByIdAndUpdate(
			req.params.id,
			{
				isTopFan: true,
			},
			{ new: true }
		)

		return res.json({ message: 'Set user is top fan', data: user })
	} catch (error: any) {
		return res.status(500).json({
			message: error.message,
			error,
			errorCode: 'utf5001',
		})
	}
}
