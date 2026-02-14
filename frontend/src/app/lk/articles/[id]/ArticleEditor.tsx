'use client'

import { ChangeEvent, useRef, useState } from 'react'
import { Controller } from 'react-hook-form'

import { Heading } from '@/components/ui/Heading'
import Loader from '@/components/ui/Loader'
import { Button } from '@/components/ui/buttons/Button'
import { DatePicker } from '@/components/ui/task-edit/date-picker/DatePicker'
import { Field } from '@/components/ui/fields/Field'
import { RichTextEditor } from '@/components/ui/fields/RichTextEditor'

import { useArticleDetails } from '../hooks/useArticleDetails'

interface ArticleEditorProps {
	id: string
}

interface ErrorMessageProps {
	message?: string
}

const ErrorMessage = ({ message }: ErrorMessageProps) => {
	if (!message) return null
	return <p className='mt-1 text-sm text-red-500'>{message}</p>
}

export function ArticleEditor({ id }: ArticleEditorProps) {
	const {
		isCreate,
		isLoading,
		isError,
		isPending,
		register,
		handleSubmit,
		control,
		setValue,
		watch,
		errors,
		onSubmit
	} = useArticleDetails({ id })
	const imageInputRef = useRef<HTMLInputElement | null>(null)
	const [imagePreview, setImagePreview] = useState<string | null>(null)
	const [imageName, setImageName] = useState('')
	const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null)
	const imageUrl = watch('image_url')
	const previewSrc = imagePreview || imageUrl || ''

	const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0]

		if (!file) {
			setImagePreview(null)
			setImageName('')
			setSelectedImageFile(null)
			return
		}

		if (!file.type.startsWith('image/')) {
			if (imageInputRef.current) imageInputRef.current.value = ''
			setImagePreview(null)
			setImageName('')
			setSelectedImageFile(null)
			return
		}

		const reader = new FileReader()

		reader.onload = () => {
			setImagePreview(String(reader.result || ''))
		}
		reader.readAsDataURL(file)
		setImageName(file.name)
		setSelectedImageFile(file)
	}

	const removeSelectedImage = () => {
		setImagePreview(null)
		setImageName('')
		setSelectedImageFile(null)
		setValue('image_url', '', {
			shouldDirty: true,
			shouldValidate: true
		})
		if (imageInputRef.current) imageInputRef.current.value = ''
	}

	const handleFormSubmit = handleSubmit(data => {
		onSubmit(data, selectedImageFile)
	})

	if (isLoading) return <Loader />

	if (isError) {
		return (
			<div className='text-sm text-red-500'>Не удалось загрузить статью.</div>
		)
	}

	return (
		<div>
			<Heading title={isCreate ? 'Новая статья' : 'Редактирование'} />
			<form
				className='mt-6 flex flex-col gap-6'
				onSubmit={handleFormSubmit}
			>
				<div className='grid grid-cols-2 gap-6'>
					<div>
						<Field
							id='title'
							label='Заголовок'
							placeholder='Введите заголовок'
							state={errors.title ? 'error' : undefined}
							{...register('title', {
								required: 'Укажите заголовок'
							})}
						/>
						<ErrorMessage message={errors.title?.message} />
					</div>
					<div>
						<Field
							id='tag'
							label='Тег'
							placeholder='Например, Инструкция'
							state={errors.tag ? 'error' : undefined}
							{...register('tag', {
								required: 'Укажите тег'
							})}
						/>
						<ErrorMessage message={errors.tag?.message} />
					</div>
					<div>
						<label
							htmlFor='date'
							className='text-sm text-primary/60 dark:text-primary ml-1.5 font-medium'
						>
							Дата
						</label>
						<Controller
							control={control}
							name='date'
							rules={{ required: 'Укажите дату' }}
							render={({ field }) => (
								<DatePicker
									value={field.value}
									onChange={field.onChange}
								/>
							)}
						/>
						<ErrorMessage message={errors.date?.message} />
					</div>
					<div>
						<Field
							id='read_time'
							label='Время чтения'
							placeholder='5 мин чтения'
							state={errors.read_time ? 'error' : undefined}
							{...register('read_time', {
								required: 'Укажите время чтения'
							})}
						/>
						<ErrorMessage message={errors.read_time?.message} />
					</div>
				</div>

				<div>
					{isCreate ? (
						<>
							<label
								htmlFor='article-image'
								className='text-sm text-primary/60 dark:text-primary ml-1.5 font-medium'
							>
								Изображение статьи
							</label>
							<input
								ref={imageInputRef}
								id='article-image'
								type='file'
								accept='image/*'
								className='mt-2 block w-full cursor-pointer rounded-lg border border-border bg-white/0 p-3 text-sm text-primary outline-none transition-colors file:mr-3 file:cursor-pointer file:rounded-md file:border-0 file:bg-sidebar file:px-3 file:py-2 file:text-sm file:text-primary focus:border-primary'
								onChange={handleImageChange}
							/>
							{imageName ? (
								<p className='mt-2 text-sm text-primary/60'>Выбрано: {imageName}</p>
							) : null}
							{previewSrc ? (
								<div className='mt-4'>
									<img
										src={previewSrc}
										alt='Превью изображения статьи'
										className='h-44 w-full max-w-md rounded-lg border border-border object-cover'
									/>
									<button
										type='button'
										className='mt-2 text-sm text-red-500 hover:underline'
										onClick={removeSelectedImage}
									>
										Удалить изображение
									</button>
								</div>
							) : null}
						</>
					) : (
						<div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
							<div>
								<Field
									id='image_url'
									label='Ссылка на изображение'
									placeholder='https://...'
									state={errors.image_url ? 'error' : undefined}
									{...register('image_url')}
								/>
								<ErrorMessage message={errors.image_url?.message} />
							</div>
						</div>
					)}
				</div>

				<div>
					<label
						htmlFor='excerpt'
						className='text-sm text-primary/60 dark:text-primary ml-1.5 font-medium'
					>
						Краткое описание
					</label>
					<textarea
						id='excerpt'
						rows={4}
						placeholder='Короткое описание статьи'
						className='mt-2 w-full rounded-lg border border-border bg-white/0 p-3 text-base text-primary outline-none placeholder:text-primary/30 placeholder:font-normal transition-colors focus:border-primary'
						{...register('excerpt', {
							required: 'Укажите краткое описание'
						})}
					/>
					<ErrorMessage message={errors.excerpt?.message} />
				</div>

				<div>
					<label className='text-sm text-primary/60 dark:text-primary ml-1.5 font-medium'>
						Контент статьи
					</label>
					<div className='mt-2'>
						<Controller
							control={control}
							name='content_html'
							rules={{ required: 'Добавьте контент статьи' }}
							render={({ field }) => (
								<RichTextEditor
									value={field.value}
									onChange={field.onChange}
									placeholder='Введите текст статьи'
								/>
							)}
						/>
					</div>
					<ErrorMessage message={errors.content_html?.message} />
				</div>

				<Button
					type='submit'
					disabled={isPending}
					className='max-w-[240px]'
				>
					{isCreate ? 'Создать статью' : 'Сохранить изменения'}
				</Button>
			</form>
		</div>
	)
}
