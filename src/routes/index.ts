import { Express } from 'express'
import authRouter from './auth.router'
import blogsRouter from './blogs.router'
import categoriesRouter from './categories.router'
import usersRouter from './users.router'

export default function route(app: Express) {
	app.use('/api/auth', authRouter)
	app.use('/api/categories', categoriesRouter)
	app.use('/api/blogs', blogsRouter)
	app.use('/api/users', usersRouter)

	app.all('*', (req, res) => {
		res.status(404).json({
			message: 'Route not found',
		})
	})
}
