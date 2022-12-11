import bcrypt from 'bcrypt'
import { Response } from 'express'
import { RequestWithAuth } from '~/middleware/auth'
import User from '~/models/user.model'

export default async function changePassword(
	req: RequestWithAuth,
	res: Response
) {
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
