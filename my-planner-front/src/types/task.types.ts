import { IBase } from './root.types'

export enum EnumTaskPriority {
	low = 'low',
	medium = 'medium',
	high = 'high'
}

export interface ITaskResponse extends IBase {
	name: string
	priority?: EnumTaskPriority
	isCompleted: boolean
}

// Вырезаем из ITaskResponse поля id и updatedAt через Omit
export type TypeTaskFormState = Partial<Omit<ITaskResponse, 'id' | 'updatedAt'>>
