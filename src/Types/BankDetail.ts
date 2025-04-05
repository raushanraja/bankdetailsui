import { AutoSaveKeys } from '../Services/IBankDetailSaver'

export interface IBankDetail {
    serialNubmer: number
    id: string
    name: string
    accountNumber: string
    ifscCode: string
}

export interface IBankDetailStorage {
    id: number
    name: AutoSaveKeys
    data: IBankDetail[]
}
