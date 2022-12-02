import bcrypt from 'bcrypt'
import { Request, Response } from 'express'
import User from '../models/user.model'
import getErrorMessage from '../utils/getErrorMessage'
import sendEmail from '../utils/sendEmail'
import { generateActiveToken, verifyActiveToken } from '../utils/token'

interface LoginData {
	firstName: string
	lastName: string
	email: string
	password: string
}

export const register = async (req: Request, res: Response) => {
	try {
		const { firstName, lastName, email, password }: LoginData = req.body

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
	} catch (error) {
		return res.status(500).json({
			message: getErrorMessage(error),
			error,
			errorCode: 'aer5001',
		})
	}
}

export const active = async (req: Request, res: Response) => {
	try {
		const token: string = req.body.token

		const { firstName, lastName, email, password } =
			verifyActiveToken(token)

		const user = await User.findOne({ email, type: 'register' })

		if (user)
			return res.status(400).json({
				message: 'User already exists',
				errorCode: 'aac4001',
			})

		const newUser = new User({ firstName, lastName, email, password })

		await newUser.save()

		return res.json({ message: 'Active successfully' })
	} catch (error) {
		if (error instanceof Error) {
			if (error.name === 'TokenExpiredError')
				return res
					.status(400)
					.json({ message: 'Token expired', errorCode: 'aac4002' })
			else if (error.name === 'JsonWebTokenError')
				return res
					.status(400)
					.json({ message: 'Token invalid', errorCode: 'aac4003' })
		}

		return res.status(500).json({
			message: getErrorMessage(error),
			error,
			errorCode: 'aac5001',
		})
	}
}
