import { Request, Response } from 'express'
import { RequestWithAuth } from '../middleware/auth'
import User from '../models/user.model'
import bcrypt from 'bcrypt'

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

export const changePassword = async (req: RequestWithAuth, res: Response) => {
	try {
		const { password, newPassword } = req.body

		const user = await User.findById(req.user._id)

		if (!user) return res.status(400).json({ message: 'User not found' })

		const isMatch = await bcrypt.compare(password, user.password)

		if (!isMatch)
			return res.status(400).json({
				message: 'Password does not match',
				errorCode: 'ucp4001',
			})

		const hashedPassword = await bcrypt.hash(newPassword, 10)

		await User.findByIdAndUpdate(user._id, { password: hashedPassword })

		return res.json({
			message: 'Password changed successfully',
		})
	} catch (error: any) {
		return res.status(500).json({
			message: error.message,
			error,
			errorCode: 'ucp5001',
		})
	}
}

export const get = async (req: Request, res: Response) => {
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

export const getTopUser = async (req: Request, res: Response) => {
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
