import type { ButtonHTMLAttributes, PropsWithChildren } from 'react'

import { cn } from '@/lib/utils'

type TypeButton = ButtonHTMLAttributes<HTMLButtonElement>

export function Button({
	children,
	className,
	...rest
}: PropsWithChildren<TypeButton>) {
	return (
		<button
			className={cn(
				'linear rounded-lg bg-transparent border border-border py-2 px-7 text-base font-medium text-primary transition-colors hover:bg-primary/10 hover:border-primary/80 active:bg-primary/20 active:border-primary active:text-primary',
				className
			)}
			{...rest}
		>
			{children}
		</button>
	)
}
