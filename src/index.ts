import cookieParser from 'cookie-parser'
import cors, { CorsOptions } from 'cors'
import 'dotenv/config'
import express from 'express'
import morgan from 'morgan'
import connectToDatabase from './config/db'
import route from './routes'

const app = express()
const PORT = process.env.PORT || 5000

const corsOptions: CorsOptions = {
	origin: [`${process.env.CLIENT_URL}`],
	credentials: true,
}

app.use(express.json())
app.use(cookieParser())
app.use(morgan('dev'))
app.use(cors(corsOptions))

connectToDatabase()

route(app)

app.listen(PORT, () => {
	console.log(`Server running at http://localhost:${PORT}`)
})
