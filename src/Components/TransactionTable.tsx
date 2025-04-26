import { Component, createEffect, createSignal, For } from 'solid-js'
import {
    ITransactionDetail,
    ITransactionDetailStorage,
} from '../Types/TransactionDetail'
import { AutoSaver } from '../Services/IBankDetailSaver'
import TransactionPDF from './TransactionPDF'
import AccoundDetails from './BankAccountCheckModal'

const texts = {
    EN: {
        save: 'Save',
        edit: 'Edit',
        placeholderPrefix: 'Enter value for',
        transactionListHeading: 'Transaction List',
        id: 'ID',
        name: 'Name',
        accountNumber: 'Account Number',
        ifscCode: 'IFSC Code',
        amount: 'Amount',
        saveTransactions: 'Save Transactions',
        print: 'Print',
        noTransactions: 'No transactions available to print.',
    },
    HI: {
        save: 'सहेजें',
        edit: 'संपादित करें',
        placeholderPrefix: 'इनपुट करें',
        transactionListHeading: 'लेन-देन सूची',
        id: 'आईडी',
        name: 'नाम',
        accountNumber: 'खाता संख्या',
        ifscCode: 'आईएफएससी कोड',
        amount: 'राशि',
        saveTransactions: 'लेन-देन सहेजें',
        print: 'प्रिंट करें',
        noTransactions: 'प्रिंट करने के लिए कोई लेन-देन उपलब्ध नहीं है।',
    },
}

const language = (localStorage.getItem('language') as 'EN' | 'HI') || 'HI'

type TransactionTableProps = {
    transactionList: ITransactionDetail[]
    saveTransactions: () => void
}

const bankName = localStorage.getItem('bankName') || ''
const samitiName = localStorage.getItem('samitiName') || ''

const TransactionTable: Component<TransactionTableProps> = (props) => {
    const [accountNumber, setAccountNumber] = createSignal<string>('')
    const [checkNumber, setCheckNumber] = createSignal<string>('')

    const autosaver = new AutoSaver<ITransactionDetailStorage>(
        'bankTransactions',
        200,
    ) // Update maxVersions to 200

    const handlePrint = () => {
        if (props.transactionList.length === 0) {
            alert(texts[language].noTransactions)
            return
        }
        const account_modal = document.getElementById('account_modal') as HTMLDialogElement
        account_modal.showModal()
        account_modal.addEventListener(
            'close',
            () => {
                TransactionPDF({
                    transactionDetails: props.transactionList,
                    heading: texts[language].transactionListHeading,
                    accountNumber: accountNumber(),
                    checkNumber: checkNumber(),
                    border: true,
                    bankName,
                    samitiName,
                })
            },
            { once: true },
        )
    }

    createEffect(() => {
        const data = props.transactionList
        if (data.length > 0) {
            const storage_data: ITransactionDetailStorage = {
                id: 0,
                name: 'bankTransactions',
                data,
            }
            autosaver.save(storage_data).then(() => {
                console.log('Transactions saved successfully')
            })
        }
    })

    return (
        <div class="container">
            <AccoundDetails
                accountNumber={accountNumber}
                setAccountNumber={setAccountNumber}
                checkNumber={checkNumber}
                setCheckNumber={setCheckNumber}
            />
            <div class="rounded-box border-base-content/5 bg-base-300 h-[800px] border">
                <h2 class="mb-4 text-2xl font-semibold">
                    {texts[language].transactionListHeading}
                </h2>
                <table class="table-zebra table w-full">
                    <thead>
                        <tr>
                            <th>{texts[language].id}</th>
                            <th>{texts[language].name}</th>
                            <th>{texts[language].accountNumber}</th>
                            <th>{texts[language].ifscCode}</th>
                            <th>{texts[language].amount}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <For each={props.transactionList}>
                            {(transaction) => (
                                <tr>
                                    <td>{transaction.id}</td>
                                    <td>{transaction.name}</td>
                                    <td>{transaction.accountNumber}</td>
                                    <td>{transaction.ifscCode}</td>
                                    <td>{transaction.amount}</td>
                                </tr>
                            )}
                        </For>
                    </tbody>
                </table>
            </div>
            <div class="flex justify-end">
                <button
                    class="btn-primary btn mt-4"
                    onClick={props.saveTransactions}
                >
                    {texts[language].saveTransactions}
                </button>

                <button class="btn-primary btn mt-4" onClick={handlePrint}>
                    {texts[language].print}
                </button>
            </div>
        </div>
    )
}

export default TransactionTable