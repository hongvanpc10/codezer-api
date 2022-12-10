import { NextFunction, Response } from 'express'
import User from '../models/user.model'
import { verifyAccessToken } from '../utils/token'
import { RequestWithAuth } from './auth'

export default async function admin(
	req: RequestWithAuth,
	res: Response,
	next: NextFunction
) {
	try {
		if (req.user.role === 'admin') return next()

		return res.status(400).json({ message: 'Admin required' })
	} catch (error: any) {
		return res.status(500).json({
			message: error.message,
			error,
			errorCode: 'mau5001',
		})
	}
}
