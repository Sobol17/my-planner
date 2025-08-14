import { IBase } from './root.types'

export interface ITimeBlockResponse extends IBase {
	name: string
	color?: string
	duration: number
	order: number
}

// Вырезаем из ITaskResponse поля id и updatedAt через Omit
export type TypeTimeBlockFormState = Partial<
	Omit<ITimeBlockResponse, 'createdAt' | 'updatedAt'>
>
