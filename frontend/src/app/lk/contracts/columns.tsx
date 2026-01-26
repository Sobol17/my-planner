'use client'

import { ColumnDef } from '@tanstack/react-table'

import { IContract } from '@/types/contracts.types'

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const columns: ColumnDef<IContract>[] = [
	{
		accessorKey: 'contractNumber',
		header: 'Номер договора'
	},
	{
		accessorKey: 'createdAt',
		header: 'Дата заключения'
	},
	{
		accessorKey: 'deadmanFullName',
		header: 'ФИО умершего'
	},
	{
		accessorKey: 'clientFullName',
		header: 'ФИО заказчика'
	},
	{
		accessorKey: 'clientPhone',
		header: 'Телефон заказчика'
	},
	{
		accessorKey: 'price',
		header: 'Итог'
	}
]
