import mongoose from 'mongoose'

export default async function connectToDatabase() {
	try {
		await mongoose.connect(process.env.DB_URI as string, {
			dbName: 'codezer',
		})

		console.log(`Connected to database successfully`)
	} catch (error) {
		console.log(error)
	}
}
