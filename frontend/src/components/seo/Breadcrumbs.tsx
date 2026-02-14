import Link from 'next/link'

import type { BreadcrumbItem } from '@/lib/seo'

type BreadcrumbsProps = {
	items: BreadcrumbItem[]
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
	return (
		<nav
			className='mb-6 text-xs text-black/50'
			aria-label='Хлебные крошки'
		>
			{items.map((item, index) => {
				const isLast = index === items.length - 1

				if (isLast) {
					return (
						<span
							key={item.path}
							className='text-black/70'
						>
							{item.name}
						</span>
					)
				}

				return (
					<span key={item.path}>
						<Link
							href={item.path}
							className='transition hover:text-black'
						>
							{item.name}
						</Link>
						<span className='px-2'>/</span>
					</span>
				)
			})}
		</nav>
	)
}
