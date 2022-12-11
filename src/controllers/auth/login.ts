import bcrypt from 'bcrypt'
import { Request, Response } from 'express'
import User from '~/models/user.model'
import { generateAccessToken, generateRefreshToken } from '~/utils/token'

export default async function login(req: Request, res: Response) {
	try {
		const { email, password } = req.body

		const user = await User.findOne({
			email,
			type: 'register',
		}).select('-savedBlogs')

		if (!user)
			return res.status(400).json({
				message: 'Email does not exist',
				errorCode: 'ali4001',
			})

		const isPasswordMatch = await bcrypt.compare(password, user.password)

		if (!isPasswordMatch)
			return res.status(400).json({
				message: 'Password does not match',
				errorCode: 'ali4002',
			})

		const refreshToken = generateRefreshToken({ id: user._id })
		const accessToken = generateAccessToken({ id: user._id })

		res.cookie('refreshToken', refreshToken, {
			maxAge: 30 * 24 * 60 * 60 * 1000,
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			path: '/api/auth/refresh-token',
		})

		user.password = ''

		return res.json({
			message: 'Logged in successfully',
			accessToken,
			data: user,
		})
	} catch (error: any) {
		return res.status(500).json({
			message: error.message,
			error,
			errorCode: 'ali5001',
		})
	}
}
