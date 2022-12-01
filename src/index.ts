import cookieParser from 'cookie-parser'
import 'dotenv/config'
import express from 'express'
import morgan from 'morgan'
import connectToDatabase from './config/db'
import route from './routes'

const app = express()
const PORT = process.env.PORT || 5000

app.use(express.json())
app.use(cookieParser())
app.use(morgan('dev'))

connectToDatabase()

route(app)

app.listen(PORT, () => {
	console.log(`Server running at http://localhost:${PORT}`)
})
