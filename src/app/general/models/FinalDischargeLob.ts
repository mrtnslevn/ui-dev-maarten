export interface FinalDischargeLob {
    key: string,
    value: string
}

export class FinalDischargeLob {
    static default(): FinalDischargeLob {
        return {
            key: "",
            value: ""
        }
    }
}
