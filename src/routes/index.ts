import { Express } from 'express'
import authRouter from './auth.router'
import blogsRouter from './blogs.router'
import categoriesRouter from './categories.router'

export default function route(app: Express) {
	app.use('/api/auth', authRouter)
	app.use('/api/categories', categoriesRouter)
	app.use('/api/blogs', blogsRouter)

	app.all('*', (req, res) => {
		res.status(404).json({
			message: 'Route not found',
		})
	})
}
