import { Request } from 'express'

interface DefaultValue {
	limit?: number
	sort?: string
	order?: 1 | -1
	page?: number
}

export default function paginate(req: Request, defaultValue?: DefaultValue) {
	const limit = Number(req.query.limit) || defaultValue?.limit || 6
	const sortValue =
		<string>req.query.sort || defaultValue?.sort || 'createdAt'
	const sortOrder =
		<1 | -1>Number(req.query.order) || defaultValue?.order || -1
	const page = Number(req.query.page) || defaultValue?.page || 1

	const skip = (page - 1) * limit
	const sort = { [sortValue]: sortOrder }
	const sortString = `${sortOrder === 1 ? '' : '-'}${sortValue}`

	return { limit, sort, page, skip, sortString }
}
