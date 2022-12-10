import mongoose from 'mongoose'
const slug = require('mongoose-slug-updater')

mongoose.plugin(slug)

const blogSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: true,
			trim: true,
		},
		description: {
			type: String,
			trim: true,
			default: '',
		},
		slug: {
			type: String,
			slug: 'title',
			unique: true,
		},
		thumb: {
			type: String,
			trim: true,
			default: '',
		},
		content: {
			type: String,
			required: true,
		},
		author: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
		},
		categories: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Category',
			},
		],
		likes: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'User',
			},
		],
	},
	{ timestamps: true }
)

export default mongoose.model('Blog', blogSchema)
