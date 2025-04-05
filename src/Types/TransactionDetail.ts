import { AutoSaveKeys } from '../Services/IBankDetailSaver'

export interface ITransactionDetail {
    id: string
    name: string
    accountNumber: string
    ifscCode: string
    amount: string
}

export interface ITransactionDetailStorage {
    id: number
    name: AutoSaveKeys
    data: ITransactionDetail[]
}
