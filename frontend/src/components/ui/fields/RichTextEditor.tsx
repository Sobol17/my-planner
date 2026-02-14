'use client'

import dynamic from 'next/dynamic'

import { cn } from '@/lib/utils'

const ReactQuill = dynamic(() => import('react-quill'), {
	ssr: false
})

type RichTextEditorProps = {
	value: string
	onChange: (value: string) => void
	placeholder?: string
	className?: string
}

const modules = {
	toolbar: [
		[{ header: [1, 2, 3, false] }],
		['bold', 'italic', 'underline', 'blockquote'],
		[{ list: 'ordered' }, { list: 'bullet' }],
		['link', 'clean']
	]
}

const formats = [
	'header',
	'bold',
	'italic',
	'underline',
	'blockquote',
	'list',
	'bullet',
	'link'
]

export function RichTextEditor({
	value,
	onChange,
	placeholder,
	className
}: RichTextEditorProps) {
	return (
		<div className={cn('quill-editor', className)}>
			<ReactQuill
				theme='snow'
				value={value ?? ''}
				onChange={onChange}
				placeholder={placeholder}
				modules={modules}
				formats={formats}
			/>
		</div>
	)
}
