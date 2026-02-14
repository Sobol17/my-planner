import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { CheckItem } from '@/components/landing/CheckItem'
import { Footer } from '@/components/landing/Footer'
import { Header } from '@/components/landing/Header'
import { PackageCoffinsSlider } from '@/components/packages/PackageCoffinsSlider'
import { Breadcrumbs } from '@/components/seo/Breadcrumbs'
import { JsonLd } from '@/components/seo/JsonLd'
import { PACKAGES } from '@/constants/landing.constants'
import {
	getPackagePageConfigBySlug,
	PACKAGE_PAGE_LIST
} from '@/data/package-pages.data'
import { buildSeoMetadata, createBreadcrumbSchema } from '@/lib/seo'
import { computePackagePrice, rub } from '@/utils/landing'

type PackageDetailsPageProps = {
	params: {
		slug: string
	}
}

export const dynamicParams = false

export function generateStaticParams() {
	return PACKAGE_PAGE_LIST.map(page => ({ slug: page.slug }))
}

export function generateMetadata({ params }: PackageDetailsPageProps): Metadata {
	const page = getPackagePageConfigBySlug(params.slug)

	if (!page) {
		return {
			title: { absolute: 'Страница не найдена' },
			robots: { index: false, follow: false }
		}
	}

	return buildSeoMetadata({
		title: page.title,
		description: page.description,
		path: page.path
	})
}

export default function PackageDetailsPage({ params }: PackageDetailsPageProps) {
	const page = getPackagePageConfigBySlug(params.slug)

	if (!page) {
		notFound()
	}

	const pkg = PACKAGES.find(item => item.id === page.id)

	if (!pkg) {
		notFound()
	}

	const priceWithFence = computePackagePrice(
		pkg.basePrice,
		true,
		pkg.fence ?? 0,
		pkg.hasFenceToggle
	)
	const priceWithoutFence = pkg.hasFenceToggle
		? computePackagePrice(pkg.basePrice, false, pkg.fence ?? 0, true)
		: priceWithFence
	const minPrice = Math.min(priceWithFence, priceWithoutFence)

	const breadcrumbs = [
		{ name: 'Главная', path: '/' },
		{ name: 'Пакеты услуг', path: '/pakety-uslug' },
		{ name: pkg.title, path: page.path }
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
							<div className='flex flex-wrap items-start justify-between gap-4'>
								<div>
									<h1 className='text-[30px] font-semibold leading-[1.2] tracking-[-0.01em] sm:text-[36px]'>
										{page.h1} в Иркутске
									</h1>
									<p className='mt-4 max-w-[75ch] text-[16px] leading-relaxed text-black/65'>
										{page.lead}
									</p>
								</div>
								<span className='rounded-full border border-black/10 bg-[#fafafa] px-3 py-1.5 text-xs text-black/65'>
									{pkg.tag}
								</span>
							</div>

							<section className='mt-8'>
								<h2 className='text-[22px] font-semibold'>Гробы, доступные в пакете</h2>
								<div className='mt-4'>
									<PackageCoffinsSlider
										coffins={pkg.coffins}
										packageTitle={pkg.title}
									/>
								</div>
							</section>

							<div className='mt-8 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]'>
								<div className='rounded-2xl border border-black/10 bg-[#fafafa] p-5'>
									<h2 className='text-[22px] font-semibold'>Состав пакета</h2>
									<ul className='mt-4 grid gap-2.5'>
										{pkg.highlights.map(item => (
											<CheckItem key={item}>{item}</CheckItem>
										))}
									</ul>
									<p className='mt-4 text-sm text-black/60'>
										Всего услуг в пакете: {pkg.allServicesCountLabel}
									</p>
								</div>

								<div className='rounded-2xl border border-[rgba(31,61,58,0.22)] bg-[rgba(31,61,58,0.06)] p-5'>
									<h2 className='text-[20px] font-semibold'>Стоимость</h2>
									<p className='mt-3 text-[26px] font-semibold'>
										{pkg.hasFenceToggle ? `от ${rub(minPrice)}` : rub(priceWithFence)}
									</p>
									<p className='mt-2 text-sm text-black/60'>
										Базовая цена: {rub(pkg.basePrice)}. В расчете учитывается
										пособие на погребение.
									</p>
									{pkg.hasFenceToggle ? (
										<p className='mt-2 text-sm text-black/60'>
											Вариант без оградки: {rub(priceWithoutFence)}
										</p>
									) : null}
									<div className='mt-4 grid gap-2 sm:grid-cols-2'>
										<a
											href='tel:+79500550266'
											className='inline-flex items-center justify-center rounded-xl bg-accent-land px-4 py-2.5 text-sm font-medium text-white transition hover:bg-primaryDark'
										>
											Позвонить
										</a>
										<Link
											href='/ceny'
											className='inline-flex items-center justify-center rounded-xl border border-black/15 bg-white px-4 py-2.5 text-sm font-medium text-black/80 transition hover:border-black/25'
										>
											Все цены
										</Link>
									</div>
								</div>
							</div>

							<div className='mt-8 grid gap-5 lg:grid-cols-2'>
								<section className='rounded-2xl border border-black/10 bg-white p-5'>
									<h2 className='text-[22px] font-semibold'>Кому подойдет</h2>
									<ul className='mt-4 list-disc space-y-2 pl-5 text-[15px] text-black/70'>
										{page.whoFor.map(item => (
											<li key={item}>{item}</li>
										))}
									</ul>
								</section>

								<section className='rounded-2xl border border-black/10 bg-white p-5'>
									<h2 className='text-[22px] font-semibold'>Особенности формата</h2>
									<ul className='mt-4 list-disc space-y-2 pl-5 text-[15px] text-black/70'>
										{page.formatDetails.map(item => (
											<li key={item}>{item}</li>
										))}
									</ul>
								</section>
							</div>

							<section className='mt-8'>
								<h2 className='text-[22px] font-semibold'>Полный список услуг в пакете</h2>
								<div className='mt-4 rounded-2xl border border-black/10 bg-[#fafafa] p-5'>
									<ul className='grid gap-2.5'>
										{pkg.allServices.map(item => (
											<CheckItem key={item}>{item}</CheckItem>
										))}
									</ul>
								</div>
							</section>

							<section className='mt-8'>
								<h2 className='text-[22px] font-semibold'>Частые вопросы</h2>
								<div className='mt-4 grid gap-3'>
									{page.faq.map(item => (
										<article
											key={item.question}
											className='rounded-xl border border-black/10 bg-white p-4'
										>
											<h3 className='text-[17px] font-medium'>{item.question}</h3>
											<p className='mt-2 text-[15px] leading-relaxed text-black/70'>
												{item.answer}
											</p>
										</article>
									))}
								</div>
							</section>

							<section className='mt-8'>
								<h2 className='text-[22px] font-semibold'>Смотрите также</h2>
								<div className='mt-4 grid gap-3 sm:grid-cols-2'>
									<Link
										href='/pohorony-pod-klyuch'
										className='rounded-xl border border-black/10 bg-[#fafafa] p-4 transition hover:border-black/20 hover:bg-white'
									>
										<p className='font-medium'>Похороны под ключ</p>
										<p className='mt-1 text-sm text-black/60'>
											Комплексная организация всех этапов в одном формате.
										</p>
									</Link>
									<Link
										href='/ceny'
										className='rounded-xl border border-black/10 bg-[#fafafa] p-4 transition hover:border-black/20 hover:bg-white'
									>
										<p className='font-medium'>Цены на услуги</p>
										<p className='mt-1 text-sm text-black/60'>
											Сравните стоимость пакетов и отдельных этапов.
										</p>
									</Link>
									<Link
										href='/uslugi'
										className='rounded-xl border border-black/10 bg-[#fafafa] p-4 transition hover:border-black/20 hover:bg-white'
									>
										<p className='font-medium'>Все услуги</p>
										<p className='mt-1 text-sm text-black/60'>
											Если нужен не пакет, а конкретные отдельные услуги.
										</p>
									</Link>
									<Link
										href='/pakety-uslug'
										className='rounded-xl border border-black/10 bg-[#fafafa] p-4 transition hover:border-black/20 hover:bg-white'
									>
										<p className='font-medium'>Другие пакеты</p>
										<p className='mt-1 text-sm text-black/60'>
											Посмотрите и сравните остальные варианты сопровождения.
										</p>
									</Link>
								</div>
							</section>
						</div>
					</div>
				</section>
			</main>
			<Footer />
		</div>
	)
}
