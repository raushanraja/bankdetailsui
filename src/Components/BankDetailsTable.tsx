import { Component, createEffect, onCleanup } from 'solid-js'
import { For } from 'solid-js'
import { IBankDetail, IBankDetailStorage } from '../Types/BankDetail'
import { AutoSaver } from '../Services/IBankDetailSaver'

type BankDetailsTableProps = {
    detailsList: IBankDetail[]
    saveBankDetails: () => void
}

const texts = {
    EN: {
        heading: 'Bank Details List',
        serialNumber: 'SNo.',
        code: 'Code',
        name: 'Name',
        accountNumber: 'Account Number',
        ifscCode: 'IFSC Code',
        saveBankDetails: 'Save Bank Details',
    },
    HI: {
        heading: 'बैंक विवरण सूची',
        serialNumber: 'क्रमांक',
        code: 'कोड',
        name: 'नाम',
        accountNumber: 'खाता संख्या',
        ifscCode: 'आईएफएससी कोड',
        saveBankDetails: 'बैंक विवरण सहेजें',
    },
}

const language = (localStorage.getItem('language') as 'EN' | 'HI') || 'HI'


const BankDetailsTable: Component<BankDetailsTableProps> = (props) => {
    const autosaver = new AutoSaver<IBankDetailStorage>('bankDetails', 200)

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
                <h2 class="mb-4 text-2xl font-semibold">{texts[language].heading}</h2>
                <table class="table-zebra table w-full">
                    <thead>
                        <tr>
                            <th>{texts[language].serialNumber}</th>
                            <th>{texts[language].code}</th>
                            <th>{texts[language].name}</th>
                            <th>{texts[language].accountNumber}</th>
                            <th>{texts[language].ifscCode}</th>
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
                    {texts[language].saveBankDetails}
                </button>
            </div>
        </div>
    )
}

export default BankDetailsTable
