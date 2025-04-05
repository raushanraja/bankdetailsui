import { createSignal } from 'solid-js'
import BankDetailsForm from './BankForm'
import BankDetailsTable from './BankDetailsTable'
import { IBankDetail } from '../Types/BankDetail'
import { ApiBankDetailSaver } from '../Services/IBankDetailSaver'

type BankDetailProps = {
    saver: ApiBankDetailSaver
}

const BankDetail = (props: BankDetailProps) => {
    const [detailsList, setDetailsList] = createSignal<IBankDetail[]>([])

    const addBankDetail = async (detail: IBankDetail) => {
        setDetailsList((prev) => [...prev, detail])
    }

    const saveBankDetails = async () => {
        const details = detailsList()
        if (details.length > 0) {
            await props.saver.save(details)
        } else {
            alert('No bank details to save')
        }
    }

    return (
        <div class="mx-auto flex flex-row gap-4 px-20 pt-5">
            <BankDetailsTable detailsList={detailsList()} saveBankDetails={saveBankDetails}/>
            <BankDetailsForm addBankDetail={addBankDetail} />
        </div>
    )
}

export default BankDetail
