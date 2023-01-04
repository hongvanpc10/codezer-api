import { Request, Response } from 'express'
import { JwtPayload } from 'jsonwebtoken'
import User from '~/models/user.model'
import { verifyActiveToken } from '~/utils/token'

export default async function active(req: Request, res: Response) {
	try {
		const token: string = req.body.token

		const { fullName, email, password } = <JwtPayload>(
			verifyActiveToken(token)
		)

		const user = await User.findOne({ email, type: 'register' })

		if (user)
			return res.status(400).json({
				message: 'User already exists',
				errorCode: 'aac4001',
			})

		const newUser = new User({
			fullName,
			email,
			password,
		})

		await newUser.save()

		return res.json({ message: 'Active successfully' })
	} catch (error: any) {
		if (error.name === 'TokenExpiredError')
			return res
				.status(400)
				.json({ message: 'Token expired', errorCode: 'aac4002' })

		if (error.name === 'JsonWebTokenError')
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
