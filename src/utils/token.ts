import jwt from 'jsonwebtoken'

export const generateAccessToken = (payload: object) => {
	return jwt.sign(payload, `${process.env.ACCESS_TOKEN_SECRET}`, {
		expiresIn: '1h',
	})
}

export const generateActiveToken = (payload: object) => {
	return jwt.sign(payload, `${process.env.ACTIVE_TOKEN_SECRET}`, {
		expiresIn: '5m',
	})
}

export const generateRefreshToken = (payload: object) => {
	return jwt.sign(payload, `${process.env.REFRESH_TOKEN_SECRET}`, {
		expiresIn: '30d',
	})
}

export const verifyAccessToken = (token: string) => {
	return jwt.verify(token, `${process.env.ACCESS_TOKEN_SECRET}`)
}

export const verifyActiveToken = (token: string) => {
	return jwt.verify(token, `${process.env.ACTIVE_TOKEN_SECRET}`)
}

export const verifyRefreshToken = (token: string) => {
	return jwt.verify(token, `${process.env.REFRESH_TOKEN_SECRET}`)
}
