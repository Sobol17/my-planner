'use client'

import { CoffinsModal } from '@/components/landing/CoffinsModal'
import { Footer } from '@/components/landing/Footer'
import { Header } from '@/components/landing/Header'
import { Hero } from '@/components/landing/Hero'
import { PackagesSection } from '@/components/landing/PackagesSection'
import { Reviews } from '@/components/landing/Reviews'
import { Services } from '@/components/landing/Services'
import { Steps } from '@/components/landing/Steps'
import { Trust } from '@/components/landing/Trust'
import { PACKAGES } from '@/constants/landing.constants'
import { useLandingPackages } from '@/hooks/landing/useLandingPackages'

export function LandingPageClient() {
	const {
		modalOpen,
		modalPkg,
		modalPriceText,
		fenceIncluded,
		openCoffins,
		closeCoffins,
		setFenceIncludedFor
	} = useLandingPackages(PACKAGES)

	return (
		<div className='bg-[#f4f5f6] text-[#1f1f1f] antialiased'>
			<Header />
			<Hero />
			<Services />
			<Steps />
			<PackagesSection
				packages={PACKAGES}
				fenceIncluded={fenceIncluded}
				onFenceIncludedChange={setFenceIncludedFor}
				onOpenCoffins={openCoffins}
			/>
			<Reviews />
			<Trust />
			<Footer />

			<CoffinsModal
				open={modalOpen}
				pkg={modalPkg}
				priceText={modalPriceText}
				onClose={closeCoffins}
			/>
		</div>
	)
}
