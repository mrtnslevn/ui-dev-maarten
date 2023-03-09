import { GlobalResponse } from "../GlobalResponse";

export interface EdcGenerateMessageResponse extends GlobalResponse {
    message: string;
}

export class EdcGenerateMessageResponse {
    static default(): EdcGenerateMessageResponse {
        return {
            message: ''
        }
    }
}