export interface IdentityType{
    key: string,
    value: string,
}

export class IdentityType{
    static default(): IdentityType{
        return{
            key: '',
            value: '',
        }
    }
}