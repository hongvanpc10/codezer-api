import { Request, Response } from 'express'

export default async function logout(req: Request, res: Response) {
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
