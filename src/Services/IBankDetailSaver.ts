export function hasData<T>(data: T[]): boolean {
    return data.length > 0
}

export type AutoSaveKeys = 'bankDetails' | 'bankTransactions'

type AutoSavedInfo = {
    total: number
    lastversion: number
    lastSaved: string
    lastKey: string
}

interface IAutoSaver<T> {
    save(data: T[]): Promise<void>
    clearOldVersions(): Promise<void>
    getAllSavedVersions(): Promise<T[]>
    clearAllVersions(): Promise<void>
    clearVersion(version: number): Promise<void>
    getVersionCount(): Promise<number>
    getVersion(version: number): Promise<T[]>
    getNextVersionKey(): Promise<string>
}

interface RequiredProperties {
    id: number
    name: string
}

class AutoSaver<T extends RequiredProperties> implements IAutoSaver<T> {
    private maxVersions: number
    private key: string
    private autoSavedInfo: AutoSavedInfo

    constructor(key: string, maxVersions: number = 10) {
        this.key = key
        this.maxVersions = maxVersions
        if (localStorage.getItem(key)) {
            try {
                let autoSavedInfo = localStorage.getItem(key)!
                this.autoSavedInfo = JSON.parse(autoSavedInfo)
            } catch (error) {
                console.error('Error parsing JSON:', error)
                this.autoSavedInfo = {
                    total: 0,
                    lastversion: 0,
                    lastSaved: '',
                    lastKey: '',
                }
            }
        } else {
            this.autoSavedInfo = {
                total: 0,
                lastversion: 0,
                lastSaved: '',
                lastKey: '',
            }
        }
    }

    async save(data: T[]): Promise<void> {
        if (!hasData(data)) {
            return
        }

        const versions = await this.getAllSavedVersions()
        if (versions.length >= this.maxVersions) {
            await this.clearOldVersions()
        }

        const nextVersionKey = await this.getNextVersionKey()
        localStorage.setItem(nextVersionKey, JSON.stringify(data))
    }

    async clearOldVersions(): Promise<void> {
        const lastVersion = this.autoSavedInfo.lastversion
        for (let i = 0; i < this.maxVersions; i++) {
            const versionKey = `${this.key}-${lastVersion + i}`
            if (localStorage.getItem(versionKey)) {
                localStorage.removeItem(versionKey)
            }
        }

        this.autoSavedInfo = {
            total: 0,
            lastversion: 0,
            lastSaved: '',
            lastKey: '',
        }
    }

    async getAllSavedVersions(): Promise<T[]> {
        const versions: T[] = []
        const lastVersion = this.autoSavedInfo.lastversion

        for (let i = 0; i < this.maxVersions; i++) {
            const versionKey = `${this.key}-${lastVersion + i}`
            const version = localStorage.getItem(versionKey)
            if (version) {
                versions.push(JSON.parse(version))
            }
        }
        return versions
    }

    async clearAllVersions(): Promise<void> {
        let lastversion = this.autoSavedInfo.lastversion
        for (let i = 0; i < this.maxVersions; i++) {
            const versionKey = `${this.key}-${lastversion + i}`
            localStorage.removeItem(versionKey)
        }
        this.autoSavedInfo = {
            total: 0,
            lastversion: 0,
            lastSaved: '',
            lastKey: '',
        }
    }

    async clearVersion(version: number): Promise<void> {
        localStorage.removeItem(`${this.key}-${version}`)
    }

    async getVersionCount(): Promise<number> {
        let count = 0
        let lastVersion = this.autoSavedInfo.lastversion
        for (let i = 0; i < this.maxVersions; i++) {
            const versionKey = `${this.key}-${lastVersion + i}`
            const version = localStorage.getItem(versionKey)
            if (version) {
                count += 1
            }
        }
        return count
    }

    async getVersion(version: number): Promise<T[]> {
        const data = localStorage.getItem(`${this.key}-${version}`)
        return data ? JSON.parse(data) : []
    }

    async getNextVersionKey(): Promise<string> {
        const lastVersion = this.autoSavedInfo.lastversion
        return `${this.key}-${lastVersion + 1}`
    }
}

// Interface for saving data
export interface IDataSaver<T> {
    save(data: T[]): Promise<void>
}

// Implementation for saving to JSON
export class JsonDataSaver<T> implements IDataSaver<T> {
    downloadJsonFile(data: string): void {
        const blob = new Blob([data], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        const jsonDate = new Date().toJSON()
        a.href = url
        a.download = `data-${jsonDate}.json`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
    }

    async save(data: T[]): Promise<void> {
        if (!hasData(data)) {
            alert('No data to save')
            return
        }

        const jsonData = JSON.stringify(data, null, 2)
        console.log('Saving to JSON:', jsonData)
        this.downloadJsonFile(jsonData)
    }
}

// Implementation for saving to an API
export class ApiDataSaver<T> implements IDataSaver<T> {
    async save(data: T[]): Promise<void> {
        console.log('Saving to API:', data)

        if (!hasData(data)) {
            alert('No data to save')
            return
        }

        await fetch('/api/data', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        })
    }
}

// Implementation for saving to both JSON and API
export class BothDataSaver<T> implements IDataSaver<T> {
    async save(data: T[]): Promise<void> {
        if (!hasData(data)) {
            alert('No data to save')
            return
        }

        const jsonSaver = new JsonDataSaver<T>()
        const apiSaver = new ApiDataSaver<T>()
        await jsonSaver.save(data)
        await apiSaver.save(data)
    }
}

// Factory for creating savers
export class DataSaverFactory {
    static create<T>(saverType: 'json' | 'api' | 'both'): IDataSaver<T> {
        switch (saverType) {
            case 'json':
                return new JsonDataSaver<T>()
            case 'api':
                return new ApiDataSaver<T>()
            case 'both':
                return new BothDataSaver<T>()
            default:
                throw new Error('Invalid saver type')
        }
    }
}
