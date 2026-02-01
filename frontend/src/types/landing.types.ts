export type Coffin = {
	id: string
	url: string
	name: string
	tone: number // 0..1 for placeholder illustration
}

export type PackageId = 'econom' | 'standard' | 'service' | 'premium'

export type PackageData = {
	id: PackageId
	title: string
	tag: string
	tagTone: 'neutral' | 'primary'
	basePrice: number // price BEFORE benefit subtraction
	hasFenceToggle: boolean
	fence?: number
	coffins: Coffin[]
	highlights: string[]
	allServicesCountLabel: string
	allServices: string[]
}

export type Review = {
	name: string
	city: string
	text: string
}

export type FenceState = Record<PackageId, boolean> // true = fence included, false = removed

export type ServiceItem = {
	title: string
	desc: string
	icon: 'home' | 'doc' | 'car' | 'flame' | 'drop' | 'pin'
}

export type StepItem = {
	n: number
	title: string
	desc: string
}

export type TrustItem = string

export type NavItem = {
	href: string
	label: string
}

export type HeroBadge = string
