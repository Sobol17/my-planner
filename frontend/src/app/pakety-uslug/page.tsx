import type { Metadata } from 'next'
import Link from 'next/link'

import { Footer } from '@/components/landing/Footer'
import { Header } from '@/components/landing/Header'
import { Breadcrumbs } from '@/components/seo/Breadcrumbs'
import { JsonLd } from '@/components/seo/JsonLd'
import { PACKAGES } from '@/constants/landing.constants'
import { PACKAGE_PAGE_LIST } from '@/data/package-pages.data'
import { buildSeoMetadata, createBreadcrumbSchema } from '@/lib/seo'
import { computePackagePrice, rub } from '@/utils/landing'

export const metadata: Metadata = buildSeoMetadata({
	title: 'Пакеты ритуальных услуг в Иркутске',
	description:
		'Пакеты ритуальных услуг в Иркутске: Эконом, Стандарт, Комплексный и Премиум. Сравните состав и выберите подходящий формат.',
	path: '/pakety-uslug'
})

export default function PackageListPage() {
	const breadcrumbs = [
		{ name: 'Главная', path: '/' },
		{ name: 'Пакеты услуг', path: '/pakety-uslug' }
	]

	return (
		<div className='bg-white text-[#1f1f1f] antialiased'>
			<JsonLd data={createBreadcrumbSchema(breadcrumbs)} />
			<Header />
			<main>
				<section className='py-[70px]'>
					<div className='mx-auto max-w-6xl px-6'>
						<Breadcrumbs items={breadcrumbs} />

						<div className='rounded-2xl border border-black/10 bg-white p-6 sm:p-8'>
							<h1 className='text-[30px] font-semibold leading-[1.2] tracking-[-0.01em] sm:text-[36px]'>
								Пакеты ритуальных услуг в Иркутске
							</h1>
							<p className='mt-4 max-w-[80ch] text-[16px] leading-relaxed text-black/65'>
								Собрали основные форматы сопровождения: от базового до
								расширенного. Для каждого пакета доступна отдельная страница с
								подробным описанием состава и рекомендациями по выбору.
							</p>

							<div className='mt-8 grid gap-4 md:grid-cols-2'>
								{PACKAGE_PAGE_LIST.map(page => {
									const pkg = PACKAGES.find(item => item.id === page.id)

									if (!pkg) return null

									const fullPrice = computePackagePrice(
										pkg.basePrice,
										true,
										pkg.fence ?? 0,
										pkg.hasFenceToggle
									)
									const minPrice = pkg.hasFenceToggle
										? computePackagePrice(pkg.basePrice, false, pkg.fence ?? 0, true)
										: fullPrice

									return (
										<Link
											key={page.id}
											href={page.path}
											className='rounded-2xl border border-black/10 bg-[#fafafa] p-5 transition hover:border-black/20 hover:bg-white'
										>
											<div className='flex items-start justify-between gap-3'>
												<h2 className='text-[22px] font-semibold'>{page.h1}</h2>
												<span className='rounded-full border border-black/10 bg-white px-3 py-1 text-xs text-black/60'>
													{pkg.tag}
												</span>
											</div>
											<p className='mt-2 text-sm text-black/65'>{page.lead}</p>
											<p className='mt-4 text-lg font-semibold'>
												{pkg.hasFenceToggle
													? `от ${rub(Math.min(fullPrice, minPrice))}`
													: rub(fullPrice)}
											</p>
											<p className='mt-3 text-sm font-medium text-primary'>
												Подробнее о пакете →
											</p>
										</Link>
									)
								})}
							</div>
						</div>
					</div>
				</section>
			</main>
			<Footer />
		</div>
	)
}
