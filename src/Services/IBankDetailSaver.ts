export function hasData<T>(data: T[]): boolean {
    return data.length > 0
}

export type AutoSaveKeys = 'bankDetails' | 'bankTransactions'

export class AutoSavedInfo {
    total: number
    firstVersion: number
    lastVersion: number
    lastSaved: Date

    constructor() {
        this.total = 0
        this.lastSaved = new Date()
        this.firstVersion = 1
        this.lastVersion = 0
        this.updateLastSaved = this.updateLastSaved.bind(this) // Bind method
    }

    init(firstVersion: number, lastVersion: number, lastSaved: Date) {
        this.firstVersion = firstVersion
        this.lastVersion = lastVersion
        this.lastSaved = lastSaved
    }

    toJSON(): string {
        return JSON.stringify({
            total: this.total,
            lastversion: this.lastVersion,
            lastSaved: this.lastSaved,
        })
    }

    static fromJSON(json: string): AutoSavedInfo {
        return JSON.parse(json)
    }

    static fromLocalStorage(key: string): AutoSavedInfo {
        const data = localStorage.getItem(key)
        if (data) {
            return AutoSavedInfo.fromJSON(data)
        }
        return new AutoSavedInfo()
    }

    static saveToLocalStorage(key: string, info: AutoSavedInfo): void {
        localStorage.setItem(key, info.toJSON())
    }

    updateLastSaved(key: string, action: 'add' | 'remove'): void {
        const data = localStorage.getItem(key)
        if (data) {
            if (action === 'add') {
                this.total += 1
                this.lastVersion += 1
            } else if (action === 'remove') {
                this.total = Math.max(0, this.total - 1)
                this.firstVersion = Math.min(
                    this.firstVersion + 1,
                    this.lastVersion,
                )
            }
            this.lastSaved = new Date()
            AutoSavedInfo.saveToLocalStorage(key, this)
        } else {
            if (action === 'add') {
                this.total += 1
                this.lastVersion += 1
            }
            this.lastSaved = new Date()
            AutoSavedInfo.saveToLocalStorage(key, this)
        }
    }
}

interface IAutoSaver<T> {
    save(data: T): Promise<void>
    clearOldVersions(): Promise<void>
    getAllSavedVersions(): Promise<T[]>
    clearAllVersions(): Promise<void>
    clearVersion(version: number): Promise<void>
    getVersionCount(): Promise<number>
    getVersion(version: number): Promise<T | null>
    getNextVersionKey(): Promise<string>
}

export interface RequiredProperties {
    id: number
    name: AutoSaveKeys
}

export class AutoSaver<T extends RequiredProperties> implements IAutoSaver<T> {
    private maxVersions: number
    private key: string
    private autoSavedInfo: AutoSavedInfo

    constructor(key: string, maxVersions: number = 10) {
        this.key = key
        this.maxVersions = maxVersions
        this.autoSavedInfo = AutoSavedInfo.fromLocalStorage(key)
        this.save = this.save.bind(this) // Bind method
        this.clearOldVersions = this.clearOldVersions.bind(this) // Bind method
        this.getAllSavedVersions = this.getAllSavedVersions.bind(this) // Bind method
        this.clearAllVersions = this.clearAllVersions.bind(this) // Bind method
        this.clearVersion = this.clearVersion.bind(this) // Bind method
        this.getVersionCount = this.getVersionCount.bind(this) // Bind method
        this.getVersion = this.getVersion.bind(this) // Bind method
        this.getNextVersionKey = this.getNextVersionKey.bind(this) // Bind method
    }

    async save(data: T & { data: unknown[] }): Promise<void> {
        if (!hasData(data.data)) {
            return
        }

        const totalSavedItems = this.autoSavedInfo.total
        if (totalSavedItems >= this.maxVersions) {
            await this.clearVersion(this.autoSavedInfo.firstVersion)
        }

        const nextVersionKey = await this.getNextVersionKey()
        localStorage.setItem(nextVersionKey, JSON.stringify(data))
        this.autoSavedInfo.updateLastSaved(this.key, 'add')
    }

    async clearOldVersions(): Promise<void> {
        const lastVersion = this.autoSavedInfo.lastVersion
        for (let i = 0; i < this.maxVersions; i++) {
            const versionKey = `${this.key}-${lastVersion + i}`
            if (localStorage.getItem(versionKey)) {
                localStorage.removeItem(versionKey)
            }
        }

        this.autoSavedInfo.lastVersion = Math.max(
            0,
            this.autoSavedInfo.lastVersion - 1,
        )
        this.autoSavedInfo.total = Math.max(0, this.autoSavedInfo.total - 1)
        this.autoSavedInfo.lastSaved = new Date()
        AutoSavedInfo.saveToLocalStorage(this.key, this.autoSavedInfo)
    }

    async getAllSavedVersions(): Promise<T[]> {
        const versions: T[] = []
        const firstVersion = this.autoSavedInfo.firstVersion
        const lastVersion = this.autoSavedInfo.lastVersion

        for (let i = firstVersion; i <= lastVersion; i++) {
            const versionKey = `${this.key}-${i}`
            const version = localStorage.getItem(versionKey)
            if (version) {
                versions.push(JSON.parse(version))
            }
        }
        return versions
    }

    async clearAllVersions(): Promise<void> {
        const firstVersion = this.autoSavedInfo.firstVersion
        const lastVersion = this.autoSavedInfo.lastVersion

        for (let i = firstVersion; i < lastVersion; i++) {
            const versionKey = `${this.key}-${i}`
            localStorage.removeItem(versionKey)
        }

        this.autoSavedInfo = new AutoSavedInfo()
    }

    async clearVersion(version: number): Promise<void> {
        const versionKey = `${this.key}-${version}`
        const data = localStorage.getItem(versionKey)
        if (data) {
            localStorage.removeItem(versionKey)
            this.autoSavedInfo.updateLastSaved(this.key, 'remove')
        }
    }

    async getVersionCount(): Promise<number> {
        return this.autoSavedInfo.total
    }

    async getVersion(version: number): Promise<T | null> {
        const data = localStorage.getItem(`${this.key}-${version}`)
        return data ? JSON.parse(data) : null
    }

    async getNextVersionKey(): Promise<string> {
        const lastVersion = this.autoSavedInfo.lastVersion
        return `${this.key}-${lastVersion + 1}`
    }
}

// Interface for saving data
export interface IDataSaver<T> {
    save(data: T[]): Promise<void>
}

// Implementation for saving to JSON
export class JsonDataSaver<T> implements IDataSaver<T> {
    constructor() {
        this.save = this.save.bind(this) // Bind method
        this.downloadJsonFile = this.downloadJsonFile.bind(this) // Bind method
    }

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
    constructor() {
        this.save = this.save.bind(this) // Bind method
    }

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
    constructor() {
        this.save = this.save.bind(this) // Bind method
    }

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
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
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
