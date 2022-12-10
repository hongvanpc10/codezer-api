import { NextFunction, Request, Response } from 'express'
import User from '../models/user.model'
import { verifyAccessToken } from '../utils/token'

interface Decoded {
	id: string
	iat: number
	exp: number
}

export interface RequestWithAuth extends Request {
	user?: any
}

export default async function auth(
	req: RequestWithAuth,
	res: Response,
	next: NextFunction
) {
	try {
		const token = req.header('Authorization')

		if (!token)
			return res.status(401).json({ message: 'Invalid authentication' })

		const decoded = <Decoded>verifyAccessToken(token)

		const user = await User.findById(decoded.id).select('-password')

		if (!user) return res.status(401).json({ message: 'User not found' })

		req.user = user

		return next()
	} catch (error: any) {
		return res.status(500).json({
			message: error.message,
			error,
			errorCode: 'mau5001',
		})
	}
}
