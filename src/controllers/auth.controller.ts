import bcrypt from 'bcrypt'
import { Request, Response } from 'express'
import { JwtPayload } from 'jsonwebtoken'
import User from '../models/user.model'
import sendEmail from '../utils/sendEmail'
import {
	generateAccessToken,
	generateActiveToken,
	generateRefreshToken,
	verifyActiveToken,
	verifyRefreshToken
} from '../utils/token'

export const register = async (req: Request, res: Response) => {
	try {
		const { firstName, lastName, email, password } = req.body

		const user = await User.findOne({ email, type: 'register' })

		if (user)
			return res
				.status(400)
				.json({ message: 'User already exists', errorCode: 'are4001' })

		const hashedPassword = await bcrypt.hash(password, 10)

		const activeToken = generateActiveToken({
			firstName,
			lastName,
			email,
			password: hashedPassword,
		})

		const clientUrl = process.env.CLIENT_URL
		const activeUrl = clientUrl + '/active/' + activeToken

		sendEmail({
			to: email,
			subject: 'Xác thực tài khoản tại Codezer 🎉',
			html: `<h3>Xin chào ${lastName} ${firstName}! 😍</h3><p>Cảm ơn bạn đã đăng kí tài khoản tại <a href="${clientUrl}">Codezer</a>.</p><p>Để tiếp tục, hãy truy cập liên kết dưới đây: 👇</p><p><a href="${activeUrl}">${activeUrl}</a></p><p>(Lưu ý: Liên kết chỉ có hiệu lực trong 5 phút. Nếu quá thời hạn, hãy đăng kí lại.)</p><h4>Thân ái!</h4>`,
		})

		return res.json({ message: 'Register successfully' })
	} catch (error: any) {
		return res.status(500).json({
			message: error.message,
			error,
			errorCode: 'aer5001',
		})
	}
}

export const active = async (req: Request, res: Response) => {
	try {
		const token: string = req.body.token

		const { firstName, lastName, email, password } = verifyActiveToken(
			token
		) as JwtPayload

		const user = await User.findOne({ email, type: 'register' })

		if (user)
			return res.status(400).json({
				message: 'User already exists',
				errorCode: 'aac4001',
			})

		const newUser = new User({ firstName, lastName, email, password })

		await newUser.save()

		return res.json({ message: 'Active successfully' })
	} catch (error: any) {
		if (error.name === 'TokenExpiredError')
			return res
				.status(400)
				.json({ message: 'Token expired', errorCode: 'aac4002' })
		else if (error.name === 'JsonWebTokenError')
			return res
				.status(400)
				.json({ message: 'Token invalid', errorCode: 'aac4003' })

		return res.status(500).json({
			message: error.message,
			error,
			errorCode: 'aac5001',
		})
	}
}

export const login = async (req: Request, res: Response) => {
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

export const logout = async (req: Request, res: Response) => {
	try {
		res.clearCookie('refreshToken', {
			path: '/api/auth/refresh-token',
		})

		return res.json({
			message: 'Logged out successfully',
		})
	} catch (error: any) {
		return res.status(500).json({
			message: error.message,
			error,
			errorCode: 'alo5001',
		})
	}
}

export interface Decoded {
	id: string
	iat: number
	exp: number
}

export const refreshToken = async (req: Request, res: Response) => {
	try {
		const refreshToken = req.cookies.refreshToken

		if (!refreshToken)
			return res.status(400).json({ message: 'User not logged in' })

		const decoded = <Decoded>verifyRefreshToken(refreshToken)

		const user = await User.findById(decoded.id).select(
			'-password -savedBlogs'
		)

		if (!user) return res.status(401).json({ message: 'User not found' })

		const accessToken = generateAccessToken({ id: user._id })

		return res.json({
			message: 'Refresh token successfully',
			data: user,
			accessToken,
		})
	} catch (error: any) {
		return res.status(500).json({
			message: error.message,
			error,
			errorCode: 'art5001',
		})
	}
}
