export type BankDetails = {
    serialNumber: string
    id: string
    name: string
    accountNumber: string
    ifscCode: string
}

const bankkDetailsLocalStorageKey = 'bankDetailsImported'


class BankDetailsPersistence {
    constructor() {
        this.saveBankDetails = this.saveBankDetails.bind(this)
        this.loadBankDetails = this.loadBankDetails.bind(this)
    }
    saveBankDetails(jsonText: string): boolean {
        try {
            const bankDetails: BankDetails[] = JSON.parse(jsonText);
            this.saveToLocalStorage(bankDetails);
            console.log('Bank details saved successfully.');
            return true;
        } catch (error) {
            console.error('Error saving bank details:', error);
            return false;
        }
    }

    saveToLocalStorage(value: Array<BankDetails>): void {
        try {
            const jsonString = JSON.stringify(value);
            localStorage.setItem(bankkDetailsLocalStorageKey, jsonString);
            console.log('Bank details saved to local storage.');
        } catch (error) {
            console.error('Error saving to local storage:', error);
        }
    }

    loadBankDetails(): Array<BankDetails> {
        try {
            const jsonString = localStorage.getItem(bankkDetailsLocalStorageKey);
            if (jsonString) {
                const bankDetails: Array<BankDetails> = JSON.parse(jsonString);
                console.log('Bank details loaded from local storage.');
                return bankDetails;
            }
            console.log('No bank details found in local storage.');
            return [];
        } catch (error) {
            console.error('Error loading from local storage:', error);
            return [];
        }
    }
}

const bankDetailsPersistence = new BankDetailsPersistence();

export const getAllBankDetails = (): BankDetails[] => {
    return bankDetailsPersistence.loadBankDetails();
}

export default bankDetailsPersistence;