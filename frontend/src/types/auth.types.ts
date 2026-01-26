export interface IAuthForm {
	phone: string
	password: string
}

export interface IUser {
	id: number
	name?: string
	phone: string

	workInterval?: number
	breakInterval?: number
	intervalsCount?: number
}

export interface IAuthResponse {
	access_token: string
	user: IUser
}

export type TypeUserForm = Omit<IUser, 'id'> & { password?: string }
