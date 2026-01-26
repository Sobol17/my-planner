'use client'

import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { Heading } from '@/components/ui/Heading'
import { Button } from '@/components/ui/buttons/Button'
import { Field } from '@/components/ui/fields/Field'

import { IAuthForm } from '@/types/auth.types'

import { DASHBOARD_PAGES } from '@/config/pages-url.config'

import { authService } from '@/services/auth.service'

export function Auth() {
	const { register, handleSubmit, reset } = useForm<IAuthForm>({
		mode: 'onChange'
	})

	const [isLoginForm, setIsLoginForm] = useState(false)

	const { push } = useRouter()

	const { mutate } = useMutation({
		mutationKey: ['auth'],
		mutationFn: (data: IAuthForm) =>
			authService.main(isLoginForm ? 'login' : 'register', data),
		onSuccess() {
			toast.success('Successfully login!')
			reset()
			push(DASHBOARD_PAGES.DASHBOARD)
		}
	})

	const onSubmit: SubmitHandler<IAuthForm> = data => {
		mutate(data)
	}

	return (
		<div className='flex min-h-screen'>
			<form
				className='w-1/4 m-auto shadow-md bg-brand-100/5 rounded-xl p-layout'
				onSubmit={handleSubmit(onSubmit)}
			>
				<Heading title='Вход в кабинет' />

				<Field
					id='phone'
					label='Телефон:'
					placeholder='Введите телефон:'
					type='phone'
					extra='mb-4'
					{...register('phone', {
						required: 'Телефон обязателен!'
					})}
				/>

				<Field
					id='password'
					label='Пароль: '
					placeholder='Введите пароль: '
					type='password'
					{...register('password', {
						required: 'Пароль обязателен!'
					})}
					extra='mb-6'
				/>

				<div className='flex items-center gap-5 justify-center'>
					<Button onClick={() => setIsLoginForm(true)}>Вход</Button>
					<Button onClick={() => setIsLoginForm(false)}>Регистрация</Button>
				</div>
			</form>
		</div>
	)
}
