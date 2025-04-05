import { Component, For } from 'solid-js'
import { ITransactionDetail } from '../Types/TransactionDetail'

type TransactionTableProps = {
    transactionList: ITransactionDetail[]
    saveTransactions: () => void
}

const TransactionTable: Component<TransactionTableProps> = (props) => {
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
