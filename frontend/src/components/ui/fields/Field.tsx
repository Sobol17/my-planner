import { forwardRef, type InputHTMLAttributes } from 'react'

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
	id: string
	label: string
	extra?: string
	variant?: string
	state?: 'error' | 'success'
	isNumber?: boolean
}

const formatTelInput = (value: string) => {
	const digits = value.replace(/\D/g, '')
	const hasInput = digits.length > 0
	let normalized = digits

	if (normalized.startsWith('7') || normalized.startsWith('8')) {
		normalized = normalized.slice(1)
	}

	normalized = normalized.slice(0, 9)

	if (!hasInput) {
		return ''
	}

	let result = '+7'

	if (normalized.length > 0) {
		result += ` (${normalized.slice(0, 3)}`
		if (normalized.length >= 3) {
			result += ')'
		}
	}

	if (normalized.length > 3) {
		result += ` ${normalized.slice(3, 5)}`
	}

	if (normalized.length > 5) {
		result += `-${normalized.slice(5, 7)}`
	}

	if (normalized.length > 7) {
		result += `-${normalized.slice(7, 9)}`
	}

	return result
}

export const Field = forwardRef<HTMLInputElement, InputFieldProps>(
	(
		{
			label,
			id,
			extra,
			type,
			placeholder,
			state,
			disabled,
			isNumber,
			inputMode,
			maxLength,
			onChange,
			...rest
		},
		ref
	) => {
		return (
			<div className={`${extra}`}>
				<label
					htmlFor={id}
					className={`text-sm text-primary/60 dark:text-primary ml-1.5 font-medium`}
				>
					{label}
				</label>
				<input
					ref={ref}
					disabled={disabled}
					type={type}
					id={id}
					placeholder={placeholder}
					inputMode={type === 'tel' ? 'tel' : inputMode}
					maxLength={type === 'tel' ? 17 : maxLength}
					className={`mt-2 flex w-full items-center justify-center rounded-lg border border-border bg-white/0 p-3 text-base text-primary outline-none placeholder:text-primary/30 placeholder:font-normal duration-500 transition-colors focus:border-primary ${
						disabled === true
							? '!border-none !bg-gray-100 dark:!bg-white/5 dark:placeholder:!text-[rgba(255,255,255,0.15)]'
							: state === 'error'
								? 'border-red-500 text-red-500 placeholder:text-red-500 dark:!border-red-400 dark:!text-red-400 dark:placeholder:!text-red-400'
								: state === 'success'
									? 'border-green-500 text-green-500 placeholder:text-green-500 dark:!border-green-400 dark:!text-green-400 dark:placeholder:!text-green-400'
									: ''
					}`}
					onKeyDown={event => {
						if (
							isNumber &&
							!/[0-9]/.test(event.key) &&
							event.key !== 'Backspace' &&
							event.key !== 'Tab' &&
							event.key !== 'Enter' &&
							event.key !== 'ArrowLeft' &&
							event.key !== 'ArrowRight'
						) {
							event.preventDefault()
						}
					}}
					onChange={event => {
						if (type === 'tel') {
							event.currentTarget.value = formatTelInput(event.currentTarget.value)
						}
						onChange?.(event)
					}}
					{...rest}
				/>
			</div>
		)
	}
)

Field.displayName = 'field'
