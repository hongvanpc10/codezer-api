import mongoose from 'mongoose'

const commentSchema = new mongoose.Schema({
	author: {
		type: mongoose.Types.ObjectId,
		ref: 'User',
	},
	parentBlog: {
		type: mongoose.Types.ObjectId,
		ref: 'Blog',
	},
	content: {
		type: String,
		required: true,
	},
})

export default mongoose.model('Comment', commentSchema)
