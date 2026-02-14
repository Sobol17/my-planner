const DEFAULT_SITE_URL = 'http://localhost:3000'

function normalizeSiteUrl(url: string) {
	return url.endsWith('/') ? url.slice(0, -1) : url
}

export const SITE_URL = normalizeSiteUrl(
	process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || DEFAULT_SITE_URL
)

export const SITE_NAME = 'Ритуальная служба «Архангел»'

export const BUSINESS_INFO = {
	name: 'Ритуальная служба «Архангел»',
	legalName: 'ИП Мясникова Наталья Юрьевна',
	phonePrimary: '+7 (950) 055-02-66',
	phoneSecondary: '+7 (902) 767-17-17',
	email: 'ms.natali.81@mail.ru',
	address: {
		streetAddress: 'ул. Волжская, 14, офис 105',
		addressLocality: 'Иркутск',
		addressRegion: 'Иркутская область',
		postalCode: '664046',
		addressCountry: 'RU'
	},
	geo: {
		latitude: 52.265018862801384,
		longitude: 104.31524991989137
	},
	openingHours: 'Mo-Su 00:00-23:59',
	inn: '381114399823',
	ogrn: '320385000040322'
} as const
