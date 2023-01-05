import { CookieOptions } from 'express'

const cookieOptions: CookieOptions = {
	maxAge: 30 * 24 * 60 * 60 * 1000,
	httpOnly: true,
	secure: process.env.NODE_ENV === 'production',
	path: '/api/auth/refresh-token',
	sameSite: process.env.NODE_ENV === 'production' && 'none',
}

export default cookieOptions
