'use client'

import { ContractDetailsForm } from './ContractDetailsForm'
import { ContractDetailsView } from './ContractDetailsView'
import { useContractDetails } from './hooks/useContractDetails'

interface ContractDetailsProps {
	id: string
}

export function ContractDetails({ id }: ContractDetailsProps) {
	const {
		isCreate,
		contract,
		isLoading,
		isError,
		isPending,
		errors,
		register,
		handleSubmit,
		control,
		serviceFields,
		appendService,
		removeService,
		productFields,
		appendProduct,
		removeProduct,
		calculatedPrice,
		onSubmit,
		downloadDocument
	} = useContractDetails({ id })

	if (!isCreate) {
		return (
			<ContractDetailsView
				contract={contract}
				isLoading={isLoading}
				isError={isError}
				downloadDocument={downloadDocument}
			/>
		)
	}

	return (
		<ContractDetailsForm
			errors={errors}
			register={register}
			handleSubmit={handleSubmit}
			control={control}
			serviceFields={serviceFields}
			appendService={appendService}
			removeService={removeService}
			productFields={productFields}
			appendProduct={appendProduct}
			removeProduct={removeProduct}
			calculatedPrice={calculatedPrice}
			onSubmit={onSubmit}
			isPending={isPending}
		/>
	)
}
