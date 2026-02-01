import { useEffect, useRef, useState } from 'react'

export function useReviewCard(text: string, expanded: boolean) {
	const [canExpand, setCanExpand] = useState(false)
	const textRef = useRef<HTMLParagraphElement | null>(null)

	useEffect(() => {
		const el = textRef.current
		if (!el) return

		const measure = () => {
			if (!textRef.current || expanded) return
			const hasOverflow =
				textRef.current.scrollHeight > textRef.current.clientHeight + 1
			setCanExpand(hasOverflow)
		}

		measure()
		const observer = new ResizeObserver(measure)
		observer.observe(el)
		return () => observer.disconnect()
	}, [expanded, text])

	return {
		canExpand,
		textRef
	}
}
