import {
	ContractCreateDto,
	ContractCreateResponse,
	ContractDto,
	IContract
} from '@/types/contracts.types'

import { contractsMapper } from '@/utils/contracts-mapper'

import { axiosWithAuth } from '@/api/interceptors'

class ContractService {
	private BASE_URL = '/contracts'

	async getAll(): Promise<IContract[]> {
		const res = await axiosWithAuth.get<ContractDto[]>(this.BASE_URL)
		return res.data.map(item => contractsMapper(item))
	}

	async getById(id: string): Promise<IContract> {
		const res = await axiosWithAuth.get<ContractDto>(`${this.BASE_URL}/${id}`)
		return contractsMapper(res.data)
	}

	async create(data: ContractCreateDto): Promise<ContractCreateResponse> {
		const res = await axiosWithAuth.post<ContractCreateResponse>(
			this.BASE_URL,
			data
		)
		return res.data
	}

	async downloadDocument(id: string): Promise<{
		blob: Blob
		filename: string
	}> {
		const res = await axiosWithAuth.get(`${this.BASE_URL}/${id}/download`, {
			responseType: 'blob'
		})
		const disposition = res.headers?.['content-disposition']
		const match = disposition ? /filename="(.+?)"/.exec(disposition) : null

		return {
			blob: res.data as Blob,
			filename: match?.[1] ?? ''
		}
	}

	async downloadFromUrl(url: string): Promise<{
		blob: Blob
		filename: string
	}> {
		const res = await axiosWithAuth.get(url, {
			responseType: 'blob'
		})
		const disposition = res.headers?.['content-disposition']
		const match = disposition ? /filename="(.+?)"/.exec(disposition) : null

		return {
			blob: res.data as Blob,
			filename: match?.[1] ?? ''
		}
	}
}

export const contractService = new ContractService()
