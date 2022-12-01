import bcrypt from 'bcrypt'
import { Request, Response } from 'express'
import User from '../models/user.model'

interface LoginData {
	firstName: string
	lastName: string
	email: string
	password: string
}

export const login = async (req: Request, res: Response) => {
	try {
		const { firstName, lastName, email, password }: LoginData = req.body

		const user = await User.findOne({ email })

		if (user)
			return res.status(400).json({ message: 'User already exists' })

		const hashedPassword = await bcrypt.hash(password, 10)
	} catch (error) {}
}
