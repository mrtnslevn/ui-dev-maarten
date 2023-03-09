export interface EdcParseMessageRequest {
    response_code: string,
    response_desc: string
}

export class EdcParseMessageRequest {
    static default(): EdcParseMessageRequest {
        return {
            response_code: '',
            response_desc: ''
        }
    }
}