import { Response } from 'express'
import { RequestWithAuth } from '~/middleware/auth'
import User from '~/models/user.model'

export const save = async (req: RequestWithAuth, res: Response) => {
	try {
		await User.findByIdAndUpdate(req.user._id, {
			$addToSet: { savedBlogs: req.params.id },
		})

		return res.json({ message: 'Save blog successfully' })
	} catch (error: any) {
		return res.status(500).json({
			message: error.message,
			error,
			errorCode: 'bsv5001',
		})
	}
}

export const unsave = async (req: RequestWithAuth, res: Response) => {
	try {
		await User.findByIdAndUpdate(req.user._id, {
			$pull: { savedBlogs: req.params.id },
		})

		return res.json({ message: 'Unsave blog successfully' })
	} catch (error: any) {
		return res.status(500).json({
			message: error.message,
			error,
			errorCode: 'bus5001',
		})
	}
}
