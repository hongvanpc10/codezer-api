import { Request, Response } from 'express'
import { RequestWithAuth } from '../middleware/auth'
import User from '../models/user.model'

export const update = async (req: RequestWithAuth, res: Response) => {
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
				facebook,
				twitter,
				likedIn,
				website,
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

export const setTopFan = async (req: Request, res: Response) => {
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

export const verify = async (req: Request, res: Response) => {
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
