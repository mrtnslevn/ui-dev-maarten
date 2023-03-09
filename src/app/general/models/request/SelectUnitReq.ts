export interface SelectUnitRequest {
    user_name: string,
    full_name: string,
    user_id: string,
    organization_id: number,
    login: boolean
}

export class SelectUnitRequest {
    static default(): SelectUnitRequest {
        return {
            user_name: '',
            organization_id: 0,
            user_id: '',
            full_name: '',
            login: false
        }
    }
}