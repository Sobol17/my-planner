import { useEffect, useMemo, useState } from 'react'

import type { FenceState, PackageData, PackageId } from '@/types/landing.types'
import { computePackagePrice, rub } from '@/utils/landing'

function buildInitialFenceState(packages: PackageData[]): FenceState {
	return packages.reduce(
		(acc, pkg) => {
			acc[pkg.id] = true
			return acc
		},
		{} as FenceState
	)
}

export function useLandingPackages(packages: PackageData[]) {
	const [modalPkgId, setModalPkgId] = useState<PackageId | null>(null)
	const [fenceIncluded, setFenceIncluded] = useState<FenceState>(() =>
		buildInitialFenceState(packages)
	)

	const modalPkg = useMemo(
		() => packages.find(p => p.id === modalPkgId) ?? null,
		[packages, modalPkgId]
	)

	const modalPriceText = useMemo(() => {
		if (!modalPkg) return '—'
		const included = fenceIncluded[modalPkg.id]
		const v = computePackagePrice(
			modalPkg.basePrice,
			included,
			modalPkg.fence ?? 10000,
			modalPkg.hasFenceToggle
		)
		return rub(v)
	}, [modalPkg, fenceIncluded])

	useEffect(() => {
		if (process.env.NODE_ENV === 'production') return

		console.assert(rub(11000).includes('₽'), 'rub() should format to RUB')
		console.assert(
			computePackagePrice(29900, true, 0, false) === 18900,
			'Benefit subtraction should work'
		)
		console.assert(
			computePackagePrice(69900, false, 6000, true) === 52900,
			'Fence subtraction should work'
		)

		console.assert(
			computePackagePrice(10000, true, 0, false) === 0,
			'Price should be clamped to 0'
		)
		console.assert(
			computePackagePrice(69900, true, 6000, true) === 58900,
			'Fence included should not subtract FENCE'
		)
	}, [])

	return {
		modalOpen: modalPkgId !== null,
		modalPkg,
		modalPriceText,
		fenceIncluded,
		openCoffins: (id: PackageId) => setModalPkgId(id),
		closeCoffins: () => setModalPkgId(null),
		setFenceIncludedFor: (id: PackageId, next: boolean) =>
			setFenceIncluded(state => ({ ...state, [id]: next }))
	}
}
