import { GlobalResponse } from "../GlobalResponse";
import { UserData } from "../UserData";

export interface LoginResponse extends GlobalResponse {
    login_status: boolean,
    flag_change_password: boolean,
    user_data_list: UserData[]
}