import {
	BookUser,
	LayoutDashboard,
	ScanBarcode,
	Settings,
	SquareGanttIcon
} from 'lucide-react'

import { DASHBOARD_PAGES } from '@/config/pages-url.config'

import type { IMenuItem } from './menu.interface'

export const MENU: IMenuItem[] = [
	{
		icon: LayoutDashboard,
		link: DASHBOARD_PAGES.DASHBOARD,
		name: 'Аналитика'
	},
	{
		icon: BookUser,
		link: DASHBOARD_PAGES.CONTRACTS,
		name: 'Договора'
	},
	{
		icon: SquareGanttIcon,
		link: DASHBOARD_PAGES.SERVICES,
		name: 'Услуги'
	},
	{
		icon: ScanBarcode,
		link: DASHBOARD_PAGES.PRODUCTS,
		name: 'Атрибутика'
	},
	{
		icon: Settings,
		link: DASHBOARD_PAGES.SETTINGS,
		name: 'Настройки'
	}
]
