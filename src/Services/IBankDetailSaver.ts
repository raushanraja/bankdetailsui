import { IBankDetail } from '../Types/BankDetail'

// Utility function to check if bank details are not empty
export function hasBankDetails(detail: IBankDetail[]): boolean {
    return detail.length > 0
}

// Interface for saving bank details
export interface IBankDetailSaver {
    save(detail: IBankDetail[]): Promise<void>
}

// Implementation for saving to JSON
export class JsonBankDetailSaver implements IBankDetailSaver {
    downloadJsonFile(data: string): void {
        const blob = new Blob([data], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        const jsonDate = new Date().toJSON()
        a.href = url
        a.download = `bank-details${jsonDate}.json`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
    }

    async save(detail: IBankDetail[]): Promise<void> {
        if (!hasBankDetails(detail)) {
            alert('No bank details to save')
            return
        }

        const data = JSON.stringify(detail, null, 2)
        console.log('Saving to JSON:', data)
        this.downloadJsonFile(data)
    }
}

// Implementation for saving to an API
export class ApiBankDetailSaver implements IBankDetailSaver {
    async save(detail: IBankDetail[]): Promise<void> {
        console.log('Saving to API:', detail)

        if (!hasBankDetails(detail)) {
            alert('No bank details to save')
            return
        }

        await fetch('/api/bank-details', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(detail),
        })
    }
}

// Implementation for saving to both JSON and API
export class BothBankDetailSaver implements IBankDetailSaver {
    async save(detail: IBankDetail[]): Promise<void> {
        if (!hasBankDetails(detail)) {
            alert('No bank details to save')
            return
        }

        const jsonSaver = new JsonBankDetailSaver()
        const apiSaver = new ApiBankDetailSaver()
        await jsonSaver.save(detail)
        await apiSaver.save(detail)
    }
}

// Factory for creating savers
export class BankDetailSaverFactory {
    static create(saverType: 'json' | 'api' | 'both'): IBankDetailSaver {
        switch (saverType) {
            case 'json':
                return new JsonBankDetailSaver()
            case 'api':
                return new ApiBankDetailSaver()
            case 'both':
                return new BothBankDetailSaver()
            default:
                throw new Error('Invalid saver type')
        }
    }
}
