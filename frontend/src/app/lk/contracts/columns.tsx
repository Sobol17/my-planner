'use client'

import { ColumnDef } from '@tanstack/react-table'

import { IContract } from '@/types/contracts.types'

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const columns: ColumnDef<IContract>[] = [
	{
		accessorKey: 'contractNumber',
		header: 'Номер'
	},
	{
		accessorKey: 'clientPassport',
		header: 'Паспорт'
	},
	{
		accessorKey: 'clientFullName',
		header: 'ФИО заказчика'
	},
	{
		accessorKey: 'price',
		header: 'Итог'
	},
	{
		accessorKey: 'createdAt',
		header: 'Дата заключения'
	},
	{
		accessorKey: 'deadmanAddress',
		header: 'Адрес'
	},
	{
		accessorKey: 'deadmanFullName',
		header: 'Умерший'
	},
	{
		accessorKey: 'deadmanDeathDay',
		header: 'Д.С Умершего'
	}
]
