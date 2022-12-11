import { Response } from 'express'
import { RequestWithAuth } from '~/middleware/auth'
import Blog from '~/models/blog.model'
import User from '~/models/user.model'

export default async function _delete(req: RequestWithAuth, res: Response) {
	try {
		await Blog.findOneAndDelete({
			_id: req.params.id,
			author: req.user._id,
		})

		await User.findByIdAndUpdate(req.user._id, { $inc: { scores: -8 } })

		return res.json({ message: 'Delete blog successfully' })
	} catch (error: any) {
		return res.status(500).json({
			message: error.message,
			error,
			errorCode: 'bdl5001',
		})
	}
}
