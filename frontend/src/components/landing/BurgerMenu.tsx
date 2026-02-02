'use client'

import { createPortal } from 'react-dom'

import type { NavItem } from '@/types/landing.types'

type BurgerMenuProps = {
	items: NavItem[]
	open: boolean
	onClose: () => void
}

export function BurgerMenu({ items, open, onClose }: BurgerMenuProps) {
	if (!open || typeof document === 'undefined') return null

	return createPortal(
		<div className='fixed inset-0 z-[120] lg:hidden'>
			<button
				className='absolute inset-0 bg-black/50 backdrop-blur-[6px]'
				aria-label='Закрыть меню'
				onClick={onClose}
			/>

			<div
				role='dialog'
				aria-modal='true'
				className='fixed right-0 top-0 flex h-full w-[min(320px,92vw)] flex-col bg-white shadow-[0_24px_80px_rgba(12,16,20,0.35)]'
			>
				<div className='flex items-center justify-between border-b border-black/10 px-5 py-4'>
					<span className='text-sm font-semibold text-black/70'>Меню</span>
					<button
						type='button'
						className='grid h-10 w-10 place-items-center rounded-2xl border border-black/10 bg-white/90 transition hover:bg-primarySoft'
						aria-label='Закрыть'
						onClick={onClose}
					>
						<svg
							viewBox='0 0 24 24'
							fill='none'
							xmlns='http://www.w3.org/2000/svg'
							className='h-5 w-5'
						>
							<path
								d='M7 7l10 10M17 7L7 17'
								stroke='rgba(31,31,31,0.70)'
								strokeWidth='2'
								strokeLinecap='round'
							/>
						</svg>
					</button>
				</div>

				<nav
					className='flex flex-col flex-1 gap-2 overflow-y-auto px-5 py-5'
					aria-label='Навигация'
				>
					{items.map(item => (
						<a
							key={item.href}
							href={item.href}
							onClick={onClose}
							className='rounded-xl border border-black/5 bg-white/70 px-4 py-3 text-sm text-black/70 transition hover:bg-primarySoft'
						>
							{item.label}
						</a>
					))}
				</nav>

				<div className='mt-auto border-t border-black/10 px-5 py-5'>
					<a
						href='tel:+79500550266'
						className='inline-flex w-full items-center justify-center rounded-xl bg-accent-land px-4 py-3 font-medium text-white transition active:translate-y-[1px] hover:bg-primaryDark'
					>
						Позвонить
					</a>
					<p className='mt-3 text-center text-xs text-black/50'>
						Круглосуточно
					</p>
				</div>
			</div>
		</div>,
		document.body
	)
}
