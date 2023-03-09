export interface Store{
    store_id: number,
    store_name: string
}

export class Store {
    static default(): Store {
        return {
            store_id: 0,
            store_name: ''
        }
    }
}