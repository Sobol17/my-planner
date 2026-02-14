import Cookies from 'js-cookie'

export enum EnumTokens {
	'ACCESS_TOKEN' = 'access_token',
	'REFRESH_TOKEN' = 'refresh_token'
}

export const getAccessToken = () => {
	const accessToken = Cookies.get(EnumTokens.ACCESS_TOKEN)

	if (!accessToken) return null

	const isJwt = accessToken.split('.').length === 3

	if (!isJwt) {
		removeFromStorage()
		return null
	}

	return accessToken
}

export const saveTokenStorage = (accessToken: string) => {
	Cookies.set(EnumTokens.ACCESS_TOKEN, accessToken, {
		sameSite: 'lax',
		expires: 10
	})
}

export const removeFromStorage = () => {
	Cookies.remove(EnumTokens.ACCESS_TOKEN)
	Cookies.remove(EnumTokens.ACCESS_TOKEN, { domain: 'localhost' })
}
