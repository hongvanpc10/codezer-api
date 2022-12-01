import { Express } from 'express'
import authRouter from './auth.router'

export default function route(app: Express) {
	app.use('/api/auth', authRouter)

	app.all('*', (req, res) => {
		res.status(404).json({
			message: 'Route not found',
		})
	})
}
