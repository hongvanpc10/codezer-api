import mongoose from 'mongoose'
const slug = require('mongoose-slug-updater')

mongoose.plugin(slug)

const userSchema = new mongoose.Schema(
	{
		firstName: {
			type: String,
			required: true,
			trim: true,
		},
		lastName: {
			type: String,
			required: true,
			trim: true,
		},
		email: {
			type: String,
			required: true,
			trim: true,
		},
		password: {
			type: String,
			required: true,
			trim: true,
		},
		username: {
			type: String,
			required: true,
			unique: true,
		},
		bio: {
			type: String,
			trim: true,
			default: '',
		},
		introduction: {
			type: String,
			trim: true,
			default: '',
		},
		role: {
			type: String,
			default: 'user',
			enum: ['user', 'admin'],
		},
		type: {
			type: String,
			default: 'register',
			enum: ['register', 'google', 'facebook', 'github'],
		},
		socials: {
			facebook: {
				type: String,
				trim: true,
				default: '',
			},
			twitter: {
				type: String,
				trim: true,
				default: '',
			},
			likedIn: {
				type: String,
				trim: true,
				default: '',
			},
			website: {
				type: String,
				trim: true,
				default: '',
			},
		},
		savedBlogs: [
			{
				type: mongoose.Types.ObjectId,
				ref: 'Blog',
			},
		],
		isTopFan: {
			type: Boolean,
			default: false,
		},
		scores: {
			type: Number,
			default: 0,
			min: 0,
		},
		avatar: {
			type: String,
			trim: true,
			default: '',
		},
	},
	{ timestamps: true }
)

export default mongoose.model('User', userSchema)
