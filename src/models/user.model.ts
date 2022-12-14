import mongoose from 'mongoose'
const slug = require('mongoose-slug-updater')

mongoose.plugin(slug)

const userSchema = new mongoose.Schema(
	{
		fullName: {
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
		slug: {
			type: String,
			slug: 'fullName',
			unique: true,
		},
		bio: {
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
		savedBlogs: [
			{
				type: mongoose.Types.ObjectId,
				ref: 'Blog',
			},
		],
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
		isVerified: {
			type: Boolean,
			default: false,
		},
		followers: [
			{
				type: mongoose.Types.ObjectId,
				ref: 'User',
			},
		],
		followings: [
			{
				type: mongoose.Types.ObjectId,
				ref: 'User',
			},
		],
	},
	{ timestamps: true }
)

export default mongoose.model('User', userSchema)
