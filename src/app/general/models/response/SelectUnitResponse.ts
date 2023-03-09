import { ActionPrivilege } from "src/app/containers/default-layout/_nav";
import { GlobalResponse } from "../GlobalResponse";

export interface SelectUnitResponse extends GlobalResponse {
    privileged_access: SelectUnitPrivilegeAccess[],
    session_timeout: number,
    group_id: string,
    npwp: string,
    psu: string,
}

export interface SelectUnitPrivilegeAccess {
    module_id: string,
    module_name: string,
    module_type: string,
    parent_module_id: string,
    module_url: string,
    sub_module: SelectUnitPrivilegeAccess[],
    action_list: ActionPrivilege[],
    fa_icon: string
}