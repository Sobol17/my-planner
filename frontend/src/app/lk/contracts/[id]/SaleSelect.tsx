import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue
} from '@/components/ui/select'

const defaultSaleOptions = [0, 3, 5, 7]

interface SaleSelectProps {
	value?: number
	onChange: (value: number) => void
	options?: number[]
	label?: string
	placeholder?: string
	id?: string
}

export function SaleSelect({
	value,
	onChange,
	options = defaultSaleOptions,
	label = 'Скидка',
	placeholder = 'Выберите скидку',
	id = 'sale_percent'
}: SaleSelectProps) {
	const selectedValue =
		value === null || value === undefined ? undefined : String(value)

	return (
		<div>
			<label
				htmlFor={id}
				className='text-sm text-primary/60 dark:text-primary ml-1.5 font-medium'
			>
				{label}
			</label>
			<Select
				value={selectedValue}
				onValueChange={nextValue => {
					const parsed = Number(nextValue)
					onChange(Number.isNaN(parsed) ? 0 : parsed)
				}}
			>
				<SelectTrigger
					id={id}
					className='mt-2 w-full max-w-48'
				>
					<SelectValue placeholder={placeholder} />
				</SelectTrigger>
				<SelectContent position='popper'>
					<SelectGroup>
						<SelectLabel>Скидка, %</SelectLabel>
						{options.map(option => (
							<SelectItem
								key={option}
								value={String(option)}
							>
								{option === 0 ? 'Без скидки' : `${option}%`}
							</SelectItem>
						))}
					</SelectGroup>
				</SelectContent>
			</Select>
		</div>
	)
}
