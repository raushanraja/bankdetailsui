export function hasData<T>(data: T[]): boolean {
    return data.length > 0
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
