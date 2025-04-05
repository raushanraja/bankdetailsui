import { Component, createEffect, For } from 'solid-js'
import {
    ITransactionDetail,
    ITransactionDetailStorage,
} from '../Types/TransactionDetail'
import { AutoSaver } from '../Services/IBankDetailSaver'

type TransactionTableProps = {
    transactionList: ITransactionDetail[]
    saveTransactions: () => void
}

const TransactionTable: Component<TransactionTableProps> = (props) => {
    const autosaver = new AutoSaver<ITransactionDetailStorage>(
        'bankTransactions',
        200,
    ) // Update maxVersions to 200

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
            <div class="rounded-box border-base-content/5 bg-base-300 h-[800px] border">
                <h2 class="mb-4 text-2xl font-semibold">Transaction List</h2>
                <table class="table-zebra table w-full">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Account Number</th>
                            <th>IFSC Code</th>
                            <th>Amount</th>
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
                    Save Transactions
                </button>
            </div>
        </div>
    )
}

export default TransactionTable
