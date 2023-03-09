export interface ComboBox {
    key: string,
    value: string
}

export class ComboBox {
    static default(): ComboBox {
        return {
            key: "",
            value: ""
        }
    }

    static defaultAll(): ComboBox {
        return {
            key: '',
            value: 'All'
        }
    }
}