export interface UserData {
    organization_id: number,
    organization_name: string,
    hope_organization_id: number,
    mobile_organization_id: string,
    ax_organization_id: string,
    role_id: string,
    role_name: string,
    user_id: string,
    user_name: string,
    full_name: string,
    hope_user_id: number,
    email?: string,
    birthday: string,
    handphone?: string
    user_role_id: number,
    npwp: string
}

export class UserData {
    static default(): UserData {
        return {
            organization_id: 0,
            organization_name: "",
            hope_organization_id: 0,
            mobile_organization_id: "",
            ax_organization_id: "",
            role_id: "",
            role_name: "",
            user_id: "",
            user_name: "",
            full_name: "",
            hope_user_id: 0,
            email: "",
            birthday: "",
            handphone: '',
            user_role_id: 0,
            npwp: ""
        }
    }
}