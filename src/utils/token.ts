import jwt, { JwtPayload } from 'jsonwebtoken'

export const generateAccessToken = (payload: JwtPayload) => {
	return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET as string, {
		expiresIn: '1h',
	})
}

export const generateActiveToken = (payload: JwtPayload) => {
	return jwt.sign(payload, process.env.ACTIVE_TOKEN_SECRET as string, {
		expiresIn: '5m',
	})
}

export const generateRefreshToken = (payload: JwtPayload) => {
	return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET as string, {
		expiresIn: '30d',
	})
}

export const verifyAccessToken = (token: string) => {
	return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string)
}

export const verifyActiveToken = (token: string) => {
	return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string)
}

export const verifyRefreshToken = (token: string) => {
	return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string)
}
