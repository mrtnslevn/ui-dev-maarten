export interface BankList {
    key: string,
    value: string,
}

export class BankList{
    static default(){
        return {
            key: '',
            value: ''
        }
    }
}