import { OAuth2Client } from 'google-auth-library'
import nodemailer, { SendMailOptions } from 'nodemailer'

const OAUTH_CLIENT_ID = process.env.OAUTH_CLIENT_ID
const OAUTH_CLIENT_SECRET = process.env.OAUTH_CLIENT_SECRET
const OAUTH_REFRESH_TOKEN = process.env.OAUTH_REFRESH_TOKEN
const ADMIN_EMAIL_ADDRESS = process.env.ADMIN_EMAIL_ADDRESS

const oAuth2Client = new OAuth2Client(OAUTH_CLIENT_ID, OAUTH_CLIENT_SECRET)

oAuth2Client.setCredentials({
	refresh_token: OAUTH_REFRESH_TOKEN,
})

interface Options {
	to: string
	subject?: string
	html: string
}

export default async function sendEmail({
	to,
	subject = 'Codezer',
	html,
}: Options) {
	try {
		const accessTokenObject = await oAuth2Client.getAccessToken()
		const accessToken = accessTokenObject.token as string

		const transport = nodemailer.createTransport({
			service: 'gmail',
			auth: {
				type: 'OAuth2',
				user: ADMIN_EMAIL_ADDRESS,
				clientId: OAUTH_CLIENT_ID,
				clientSecret: OAUTH_CLIENT_SECRET,
				refreshToken: OAUTH_REFRESH_TOKEN,
				accessToken,
			},
		})

		const mailOptions: SendMailOptions = {
			to,
			subject,
			html,
		}

		await transport.sendMail(mailOptions)
	} catch (error) {
		console.log(error)
	}
}
