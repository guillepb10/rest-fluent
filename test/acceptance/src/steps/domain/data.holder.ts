class ScenarioDataHolder {

    private data: Map<string, any> = new Map();

    put(key: string, value: any): void {
        this.data.set(key, value);
    }

    get(key: string): any {
        return this.data.get(key);
    }

    clear(): void {
        this.data.clear();
    }
}

let dataHolder = new ScenarioDataHolder();
export { dataHolder };