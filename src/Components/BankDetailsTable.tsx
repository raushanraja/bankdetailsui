import { Component, createEffect, onCleanup } from 'solid-js'
import { For } from 'solid-js'
import { IBankDetail, IBankDetailStorage } from '../Types/BankDetail'
import { AutoSaver } from '../Services/IBankDetailSaver'

type BankDetailsTableProps = {
    detailsList: IBankDetail[]
    saveBankDetails: () => void
}

const BankDetailsTable: Component<BankDetailsTableProps> = (props) => {
    const autosaver = new AutoSaver<IBankDetailStorage>('bankDetails', 10)

    // Effect to save formData every 10 seconds if data is available
    createEffect(() => {
        const interval = setInterval(() => {
            const data = props.detailsList
            if (data.length > 0) {
                const storage_data: IBankDetailStorage = {
                    id: 0,
                    name: 'bankDetails',
                    data,
                }
                autosaver.save(storage_data).then(() => {
                    console.log('Data saved successfully')
                })
            }
        }, 3000)

        onCleanup(() => clearInterval(interval))
    })

    return (
        <div class="container">
            <div class="rounded-box border-base-content/5 bg-base-300 h-[800px] border">
                <h2 class="mb-4 text-2xl font-semibold">Bank Details List</h2>
                <table class="table-zebra table w-full">
                    <thead>
                        <tr>
                            <th>SNo.</th>
                            {/* Ensure Serial No. column header is present */}
                            <th>Code</th>
                            <th>Name</th>
                            <th>Account Number</th>
                            <th>IFSC Code</th>
                        </tr>
                    </thead>
                    <tbody>
                        <For each={props.detailsList}>
                            {(detail) => (
                                <tr>
                                    <td>{detail.serialNubmer}</td>
                                    <td>{detail.id}</td>
                                    <td>{detail.name}</td>
                                    <td>{detail.accountNumber}</td>
                                    <td>{detail.ifscCode}</td>
                                </tr>
                            )}
                        </For>
                    </tbody>
                </table>
            </div>
            <div class="flex justify-end">
                <button
                    class="btn-primary btn mt-4"
                    onClick={props.saveBankDetails}
                >
                    Save Bank Details
                </button>
            </div>
        </div>
    )
}

export default BankDetailsTable
