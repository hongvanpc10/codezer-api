import { Response } from 'express'
import { RequestWithAuth } from '~/middleware/auth'
import User from '~/models/user.model'

export const follow = async (req: RequestWithAuth, res: Response) => {
	try {
		await User.findByIdAndUpdate(req.params.id, {
			$addToSet: { followers: req.user._id },
			$inc: { scores: 5 },
		})

		await User.findByIdAndUpdate(req.user._id, {
			$addToSet: { followings: req.params.id },
		})

		return res.json({ message: 'Follow user successfully' })
	} catch (error: any) {
		return res.status(500).json({
			message: error.message,
			error,
			errorCode: 'utu5001',
		})
	}
}

export const unfollow = async (req: RequestWithAuth, res: Response) => {
	try {
		await User.findByIdAndUpdate(req.params.id, {
			$pull: { followers: req.user._id },
			$inc: { scores: -5 },
		})

		await User.findByIdAndUpdate(req.user._id, {
			$pull: { followings: req.params.id },
		})

		return res.json({ message: 'Unfollow user successfully' })
	} catch (error: any) {
		return res.status(500).json({
			message: error.message,
			error,
			errorCode: 'utu5001',
		})
	}
}
