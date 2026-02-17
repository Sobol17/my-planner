'use client'

const DG_WIDGET_NOSCRIPT_TEXT =
	'Виджет карты использует JavaScript. Включите его в настройках вашего браузера.'

const DG_WIDGET_SRC = `https://widgets.2gis.com/widget?type=firmsonmap&options=${encodeURIComponent(
	JSON.stringify({
		pos: { lat: 52.265018862801384, lon: 104.31524991989137, zoom: 16 },
		opt: { city: 'irkutsk' },
		org: '70000001044403974'
	})
)}`

export function Footer() {
	return (
		<footer
			className='bg-primary py-[72px] text-white'
			id='contacts'
		>
			<div className='mx-auto max-w-6xl px-6'>
				<a
					href='tel:+79500550266'
					className='inline-block text-[26px] font-semibold'
				>
					+7 950-055-02-66
				</a>
				<br />
				<a
					href='tel:+9027671717'
					className='inline-block text-[26px] font-semibold'
				>
					+7 902-767-17-17
				</a>
				<p className='mt-2 opacity-90'>ул. Волжская 14, офис 105</p>
				<p className='mt-2 text-sm opacity-80'>
					Круглосуточно.{' '}
					<a
						href='mailto:ms.natali.81@mail.ru'
						className='underline decoration-white/40 underline-offset-4 transition hover:decoration-white'
					>
						ms.natali.81@mail.ru
					</a>
				</p>
				<div className='mt-6 grid gap-5 lg:grid-cols-[1.1fr_1fr]'>
					<div className='rounded-[18px] border border-white/20 bg-white/10 p-5'>
						<p className='opacity-90'>
							<strong>График</strong> круглосуточно
						</p>
						<p className='opacity-90'>
							<strong>Email</strong>{' '}
							<a
								href='mailto:ms.natali.81@mail.ru'
								className='underline decoration-white/40 underline-offset-4 transition hover:decoration-white'
							>
								ms.natali.81@mail.ru
							</a>
						</p>
						<p className='opacity-90'>
							<strong>Оплата</strong> наличные / карта / QR-код
						</p>
						<div className='mt-4 flex flex-wrap items-center gap-3'>
							<span className='text-[11px] uppercase tracking-[0.18em] opacity-70'>
								Соцсети
							</span>
							<div className='flex items-center gap-2'>
								<a
									href='https://t.me/NataliaMyasnikova2020?text=Здравствуйте, пишу вам с сайта Архангел.'
									target='_blank'
									aria-label='Telegram'
									title='Telegram'
									className='group grid h-9 w-9 place-items-center rounded-full border border-white/25 bg-white/10 text-white/80 transition hover:border-white/60 hover:bg-white/20 hover:text-white'
								>
									<svg
										viewBox='0 0 24 24'
										xmlns='http://www.w3.org/2000/svg'
										className='h-4 w-4'
										fill='currentColor'
									>
										<path d='M11.944 15.034 16.917 19.46c.711.392 1.217.183 1.398-.66l2.532-11.88c.264-1.236-.444-1.72-1.13-1.456L3.36 10.06c-1.193.463-1.176 1.107-.217 1.4l4.21 1.315 9.77-6.156c.46-.289.88-.134.534.155L9.77 13.46l-.304 3.75c.45 0 .646-.206.895-.45l1.583-1.527 3.29 2.45z' />
									</svg>
								</a>
								<a
									href='https://max.ru/u/f9LHodD0cOKe0RO5S5VorwyVXLJ9Wf62aV7UpHj3VuRyD2aiNYQT-Q4Xy8Q'
									aria-label='MAX'
									title='MAX'
									className='group grid h-9 w-9 place-items-center rounded-full border border-white/25 bg-white/10 text-white/80 transition hover:border-white/60 hover:bg-white/20 hover:text-white'
									target='_blank'
								>
									<img
										src='/max.svg'
										alt='MAX'
										className='h-4 w-4'
										loading='lazy'
									/>
								</a>
							</div>
						</div>
					</div>
					<div className='relative overflow-hidden rounded-[18px] border border-white/20 bg-white/10 p-4'>
						<div className='map text-[12px] text-white/85'>
							<div className='dg-widget-frame'>
								<iframe
									title='Карта 2GIS'
									src={DG_WIDGET_SRC}
									loading='lazy'
									referrerPolicy='no-referrer-when-downgrade'
									allowFullScreen
								/>
							</div>
							<noscript style={{ color: '#c00', fontSize: 16, fontWeight: 'bold' }}>
								{DG_WIDGET_NOSCRIPT_TEXT}
							</noscript>
						</div>
					</div>
				</div>
				<div className='mt-6 border-t border-white/15 pt-4 text-xs opacity-80'>
					<div className='flex flex-wrap items-center gap-x-4 gap-y-2'>
						<span>ИНН: 381114399823</span>
						<span>ОГРН: 320385000040322</span>
						<a
							href='/privacy'
							className='underline decoration-white/40 underline-offset-4 transition hover:decoration-white'
						>
							Политика конфиденциальности
						</a>
						<a
							href='/consent'
							className='underline decoration-white/40 underline-offset-4 transition hover:decoration-white'
						>
							Согласие на обработку данных
						</a>
					</div>
				</div>
				<p className='mt-5 text-xs opacity-70'>
					© Ритуальная служба. Информация на сайте не является публичной
					офертой.
				</p>
			</div>
		</footer>
	)
}
