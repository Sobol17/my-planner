'use client'

import { GanttChartSquare, Moon, Sun } from 'lucide-react'
import Link from 'next/link'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

import { COLORS } from '@/constants/color.constants'

import { LogoutButton } from './LogoutButton'
import { MenuItem } from './MenuItem'
import { MENU } from './menu.data'

export function Sidebar() {
	const { resolvedTheme, setTheme } = useTheme()
	const [mounted, setMounted] = useState(false)

	useEffect(() => {
		setMounted(true)
	}, [])

	const isDark = resolvedTheme === 'dark'

	return (
		<aside className='border-r border-r-border h-full bg-sidebar flex flex-col justify-between'>
			<div>
				<Link
					href='/i'
					className='flex items-center gap-2.5 p-layout border-b border-b-border'
				>
					<GanttChartSquare
						color={COLORS.primary}
						size={38}
					/>
					<span className='text-2xl font-bold relative'>Архангел</span>
				</Link>
				<div className='p-3 relative'>
					<LogoutButton />
					{MENU.map(item => (
						<MenuItem
							item={item}
							key={item.link}
						/>
					))}
				</div>
			</div>
			<footer className='text-xs font-normal text-center p-layout flex flex-col gap-3'>
				<div className='flex items-center justify-center'>
					<button
						className='inline-flex items-center gap-2 rounded-md border border-border px-3 py-1 text-xs opacity-70 hover:opacity-100 transition-opacity'
						onClick={() => setTheme(isDark ? 'light' : 'dark')}
						aria-label='Переключить тему'
					>
						{mounted ? (
							<>
								{isDark ? <Sun size={14} /> : <Moon size={14} />}
								<span>{isDark ? 'Светлая' : 'Тёмная'} тема</span>
							</>
						) : (
							<span>Тема</span>
						)}
					</button>
				</div>
				<div className='opacity-40'>
					2026 &copy; Разработал{' '}
					<a
						href='https://github.com/Sobol17'
						target='_blank'
						rel='noreferrer'
						className='hover:text-primary text-brand-300 transition-colors'
					>
						SobolDev
					</a>
					. <br /> Все права защищены.
				</div>
			</footer>
		</aside>
	)
}
