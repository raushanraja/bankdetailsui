import { AutoSavedInfo, AutoSaveKeys, AutoSaver } from '../Services/IBankDetailSaver'
import { IBankDetailStorage } from '../Types/BankDetail'
import { faker } from '@faker-js/faker'

function createFakeBankDetails(): IBankDetailStorage[] {
    const bankDetails: IBankDetailStorage[] = []
    for (let i = 0; i < 10; i++) {
        bankDetails.push({
            id: i,
            name: 'bankDetails',
            data: [
                {
                    serialNubmer: faker.number.int({ min: 1, max: 100 }),
                    id: faker.string.uuid(),
                    name: faker.person.fullName(),
                    accountNumber: faker.finance.accountNumber(),
                    ifscCode: faker.finance.bic({ includeBranchCode: true }),
                },
            ],
        })
    }
    return bankDetails
}

describe('AutoSaver BankDetails', () => {
    let autoSaver: AutoSaver<IBankDetailStorage>
    let key: AutoSaveKeys
    let maxVersions: number

    let bankDetails: IBankDetailStorage[]

    beforeEach(() => {
        key = 'bankDetails'
        maxVersions = 10
        autoSaver = new AutoSaver(key, maxVersions)
        bankDetails = createFakeBankDetails()
    })

    afterEach(() => {
        localStorage.clear()
    })

    test('should initialize with empty localStorage', () => {
        expect(autoSaver).toBeDefined()
        expect(autoSaver.getVersionCount()).resolves.toEqual(0)
    })

    test('should save data to localStorage', async () => {
        await autoSaver.save(bankDetails[0])
        const savedData = JSON.parse(localStorage.getItem('bankDetails-1')!)
        expect(savedData).not.toBeNull()
        expect(savedData).toEqual(bankDetails[0])
    })

    test('should retrieve data from localStorage', async () => {
        await autoSaver.save(bankDetails[0])
        const retrievedData = await autoSaver.getVersion(1)
        expect(retrievedData).toEqual(bankDetails[0])
    })

    test('should delete data from localStorage', async () => {
        await autoSaver.save(bankDetails[0])
        await autoSaver.clearVersion(1)
        const retrievedData = await autoSaver.getVersion(1)
        expect(retrievedData).toBeNull()
    })

    test('should clear all versions', async () => {
        for (let i = 0; i < 10; i++) {
            await autoSaver.save(bankDetails[i % bankDetails.length])
        }
        await autoSaver.clearAllVersions()
        const versionCount = await autoSaver.getVersionCount()
        expect(versionCount).toEqual(0)

        const retrievedData = await autoSaver.getVersion(1)
        expect(retrievedData).toBeNull()
    })

    test('should limit the number of versions', async () => {
        for (let i = 0; i < 10; i++) {
            await autoSaver.save(bankDetails[i % bankDetails.length])
        }
        const versionCount = await autoSaver.getVersionCount()
        expect(versionCount).toEqual(maxVersions)
    })

    test('should retrieve all versions', async () => {
        for (let i = 0; i < 10; i++) {
            await autoSaver.save(bankDetails[i % bankDetails.length])
        }
        const versions = await autoSaver.getAllSavedVersions()
        expect(versions.length).toEqual(maxVersions)

        // Match the saved versions with the bank details
        const savedVersions = versions.map((version) => version.data[0])
        const expectedVersions = bankDetails
            .slice(0, maxVersions)
            .map((bd) => bd.data[0])
        expect(savedVersions).toEqual(expectedVersions)
    })

    test('should overwrite the oldest keys when exceeding maxVersions', async () => {
        for (let i = 0; i < 15; i++) {
            await autoSaver.save(bankDetails[i % bankDetails.length])
        }
        const versionCount = await autoSaver.getVersionCount()
        expect(versionCount).toEqual(maxVersions)

        const versions = await autoSaver.getAllSavedVersions()
        expect(versions.length).toEqual(maxVersions)
    })

    test('should read data autosaveInfo from localStorage', async () => {
        const autoSaveInfo:AutoSavedInfo = new AutoSavedInfo();
        let date = new Date()
        autoSaveInfo.lastSaved = date
        autoSaveInfo.firstVersion = 1
        autoSaveInfo.lastVersion = 5
        autoSaveInfo.total = 5


        AutoSavedInfo.saveToLocalStorage('bankDetails', autoSaveInfo)
        const fetchedInfo = AutoSavedInfo.fromLocalStorage('bankDetails')

        expect(fetchedInfo).toBeDefined()
        expect(fetchedInfo.firstVersion).toEqual(1)
        expect(fetchedInfo.lastVersion).toEqual(5)
        expect(fetchedInfo.total).toEqual(5)
        expect(fetchedInfo.lastSaved).toBeInstanceOf(Date)
        expect(fetchedInfo.lastSaved).toEqual(date)
    })

})
