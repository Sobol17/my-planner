const SLUG_DELIMITER = '--'

const trimSlashes = (value: string) => value.replace(/^\/+|\/+$/g, '')

export const slugifyArticleTitle = (value: string) =>
	value
		.toLowerCase()
		.trim()
		.replace(/[^a-z0-9а-яё]+/gi, '-')
		.replace(/^-+|-+$/g, '')

export const makeArticleSlug = (title: string, id: string) => {
	const slug = slugifyArticleTitle(title)
	const preparedSlug = slug || 'article'
	return `${preparedSlug}${SLUG_DELIMITER}${id}`
}

export const extractArticleIdFromSlug = (slug: string) => {
	const normalizedSlug = trimSlashes(slug)
	const segments = normalizedSlug.split(SLUG_DELIMITER)
	return segments.length > 1 ? segments[segments.length - 1] : null
}
