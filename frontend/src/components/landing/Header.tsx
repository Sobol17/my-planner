'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

import { NAV_ITEMS } from '@/constants/landing.constants'

import { BurgerMenu } from './BurgerMenu'

export function Header() {
	const [menuOpen, setMenuOpen] = useState(false)
	const pathname = usePathname()
	const isHome = pathname === '/'
	const navItems = NAV_ITEMS.map(item => {
		if (item.href.startsWith('#')) {
			return {
				...item,
				href: isHome ? item.href : `/${item.href}`
			}
		}
		return item
	})

	useEffect(() => {
		if (!menuOpen) return
		const previous = document.body.style.overflow
		document.body.style.overflow = 'hidden'

		const onKeyDown = (event: KeyboardEvent) => {
			if (event.key === 'Escape') setMenuOpen(false)
		}
		window.addEventListener('keydown', onKeyDown)

		return () => {
			document.body.style.overflow = previous
			window.removeEventListener('keydown', onKeyDown)
		}
	}, [menuOpen])

	return (
		<>
			<header className='sticky top-0 z-50 border-b border-black/10 bg-white/90 backdrop-blur'>
				<div className='mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4'>
					<Link
						href='/'
						className='flex sm:min-w-[220px] items-center gap-3'
					>
						<Image
							src='/logotipe_new.png'
							alt='logo'
							width={240}
							height={60}
							className='h-[32px] w-[120px] sm:h-[60px] sm:w-[240px]'
						/>
					</Link>

					<nav
						className='hidden flex-1 items-center justify-center gap-2 lg:flex'
						aria-label='Навигация'
					>
						{navItems.map(item => (
							<Link
								key={item.label}
								className='rounded-xl px-3 py-2 text-sm text-black/60 transition hover:bg-primarySoft hover:text-black'
								href={item.href}
							>
								{item.label}
							</Link>
						))}
					</nav>

					<div className='flex min-w-0 items-center justify-end gap-3 lg:min-w-[280px]'>
						<span className='hidden rounded-full border border-black/10 bg-white/80 px-3 py-1.5 text-xs text-black/60 md:inline text-nowrap'>
							Организация • cопровождение 24/7
						</span>
						<a
							className='font-semibold text-primary text-xs'
							href='tel:+79500550266'
						>
							+7 (950) 055-02-66
						</a>
						<button
							type='button'
							className='grid h-11 w-11 place-items-center rounded-2xl border border-black/10 bg-white/85 text-black/70 transition hover:bg-white active:translate-y-[1px] lg:hidden'
							aria-label='Открыть меню'
							aria-expanded={menuOpen}
							onClick={() => setMenuOpen(true)}
						>
							<svg
								viewBox='0 0 24 24'
								fill='none'
								xmlns='http://www.w3.org/2000/svg'
								className='h-5 w-5'
							>
								<path
									d='M4 7h16M4 12h16M4 17h16'
									stroke='currentColor'
									strokeWidth='2'
									strokeLinecap='round'
								/>
							</svg>
						</button>
					</div>
				</div>
			</header>

			<BurgerMenu
				open={menuOpen}
				onClose={() => setMenuOpen(false)}
				items={navItems}
			/>
		</>
	)
}
