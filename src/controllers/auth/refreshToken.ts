import { Request, Response } from 'express'
import User from '~/models/user.model'
import { generateAccessToken, verifyRefreshToken } from '~/utils/token'

interface Decoded {
	id: string
	iat: number
	exp: number
}

export default async function refreshToken(req: Request, res: Response) {
	try {
		const refreshToken = req.cookies.refreshToken

		if (!refreshToken)
			return res.status(400).json({ message: 'User not logged in' })

		const decoded = <Decoded>verifyRefreshToken(refreshToken)

		const user = await User.findById(decoded.id).select(
			'-password -savedBlogs -email'
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
