import bcrypt from 'bcrypt'
import { Request, Response } from 'express'
import { OAuth2Client, TokenPayload } from 'google-auth-library'
import cookieOptions from '~/config/cookieOptions'
import User from '~/models/user.model'
import { generateAccessToken, generateRefreshToken } from '~/utils/token'

const OAUTH_CLIENT_ID = process.env.OAUTH_CLIENT_ID
const OAUTH_CLIENT_SECRET = process.env.OAUTH_CLIENT_SECRET

const oAuth2Client = new OAuth2Client(
	OAUTH_CLIENT_ID,
	OAUTH_CLIENT_SECRET,
	'postmessage'
)

export async function login(req: Request, res: Response) {
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

		res.cookie('refreshToken', refreshToken, cookieOptions)

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

export async function googleLogin(req: Request, res: Response) {
	try {
		const {
			tokens: { id_token },
		} = await oAuth2Client.getToken(req.body.code)

		const verified = await oAuth2Client.verifyIdToken({
			idToken: id_token as string,
			audience: OAUTH_CLIENT_ID,
		})

		const { email, name, picture } = verified.getPayload() as TokenPayload

		const user = await User.findOne({ email, type: 'google' })

		if (user) {
			const refreshToken = generateRefreshToken({ id: user._id })
			const accessToken = generateAccessToken({ id: user._id })

			res.cookie('refreshToken', refreshToken, cookieOptions)

			return res.json({
				message: 'Logged in successfully',
				accessToken,
				data: user,
			})
		}

		const password = await bcrypt.hash(email as string, 10)

		const newUser = new User({
			fullName: name,
			email: email,
			type: 'google',
			password,
			avatar: picture,
		})

		await newUser.save()

		newUser.password = ''

		const refreshToken = generateRefreshToken({ id: newUser._id })
		const accessToken = generateAccessToken({ id: newUser._id })

		res.cookie('refreshToken', refreshToken, cookieOptions)

		return res.json({
			message: 'Logged in successfully',
			accessToken,
			data: newUser,
		})
	} catch (error: any) {
		return res.status(500).json({
			message: error.message,
			error,
			errorCode: 'alg5001',
		})
	}
}

export async function facebookLogin(req: Request, res: Response) {
	try {
		const { accessToken: userAccessToken, userID } = req.body

		const url = `https://graph.facebook.com/${userID}/?fields=id,name,email,picture&access_token=${userAccessToken}`

		const data = await fetch(url)
			.then(res => res.json())
			.then(res => {
				return res
			})

		const { email, name } = data
		const avatar = data.picture.data.url

		const user = await User.findOne({ email, type: 'facebook' })

		if (user) {
			const refreshToken = generateRefreshToken({ id: user._id })
			const accessToken = generateAccessToken({ id: user._id })

			res.cookie('refreshToken', refreshToken, cookieOptions)

			return res.json({
				message: 'Logged in successfully',
				accessToken,
				data: user,
			})
		}

		const password = await bcrypt.hash(email as string, 10)

		const newUser = new User({
			fullName: name,
			email: email,
			type: 'facebook',
			password,
			avatar,
		})

		await newUser.save()

		newUser.password = ''

		const refreshToken = generateRefreshToken({ id: newUser._id })
		const accessToken = generateAccessToken({ id: newUser._id })

		res.cookie('refreshToken', refreshToken, cookieOptions)

		return res.json({
			message: 'Logged in successfully',
			accessToken,
			data: newUser,
		})
	} catch (error: any) {
		return res.status(500).json({
			message: error.message,
			error,
			errorCode: 'alf5001',
		})
	}
}
