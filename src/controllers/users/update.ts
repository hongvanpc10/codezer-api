import { Response } from 'express'
import { RequestWithAuth } from '~/middleware/auth'
import User from '~/models/user.model'

export default async function update(req: RequestWithAuth, res: Response) {
	try {
		const {
			firstName,
			lastName,
			bio,
			introduction,
			facebook,
			twitter,
			likedIn,
			website,
			avatar,
		} = req.body

		const user = await User.findByIdAndUpdate(
			req.user._id,
			{
				firstName,
				lastName,
				bio,
				introduction,
				socials: { facebook, twitter, likedIn, website },
				avatar,
			},
			{ new: true }
		)

		return res.json({ message: 'Update user successfully', data: user })
	} catch (error: any) {
		return res.status(500).json({
			message: error.message,
			error,
			errorCode: 'uup5001',
		})
	}
}
