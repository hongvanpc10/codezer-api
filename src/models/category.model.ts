import mongoose from 'mongoose'
const slug = require('mongoose-slug-updater')

mongoose.plugin(slug)

const categorySchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true,
			unique: true,
		},
		slug: {
			type: String,
			slug: 'name',
			unique: true,
		},
		description: {
			type: String,
			trim: true,
			default: '',
		},
	},
	{ timestamps: true }
)

export default mongoose.model('Category', categorySchema)
