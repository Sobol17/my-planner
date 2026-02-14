import type { PackageId } from '@/types/landing.types'

export const PACKAGE_SLUG_BY_ID: Record<PackageId, string> = {
	econom: 'ekonom',
	standard: 'standart',
	service: 'kompleksnyy',
	premium: 'premium'
}

export const PACKAGE_ID_BY_SLUG: Record<string, PackageId> = {
	ekonom: 'econom',
	standart: 'standard',
	kompleksnyy: 'service',
	premium: 'premium'
}

export function getPackageSlugById(id: PackageId): string {
	return PACKAGE_SLUG_BY_ID[id]
}

export function getPackageIdBySlug(slug: string): PackageId | null {
	return PACKAGE_ID_BY_SLUG[slug] ?? null
}

export function getPackagePathById(id: PackageId): string {
	return `/pakety-uslug/${getPackageSlugById(id)}`
}
