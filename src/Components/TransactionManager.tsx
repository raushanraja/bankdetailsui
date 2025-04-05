import { createSignal } from 'solid-js'
import TransactionForm from './TransactionForm'
import TransactionTable from './TransactionTable'
import { ITransactionDetail } from '../Types/TransactionDetail'

const TransactionManager = () => {
    const [transactionList, setTransactionList] = createSignal<
        ITransactionDetail[]
    >([])
    const usedIds = new Set<string>()

    const addTransaction = (transaction: ITransactionDetail) => {
        setTransactionList((prev) => [...prev, transaction])
        usedIds.add(transaction.id)
    }

    return (
        <div class="mx-auto flex flex-row gap-4 px-20 pt-5">
            <TransactionTable transactionList={transactionList()} />
            <TransactionForm
                addTransaction={addTransaction}
                usedIds={usedIds}
            />
        </div>
    )
}

export default TransactionManager
