export interface EdcGenerateMessageRequest {
    transaction_type: string,
    amount: number
    edc_id: number,
    card_type: string
}

export class EdcGenerateMessageRequest {
    static default() {
        return {
            transaction_type: "",
            amount: 0,
            edc_id: 0,
            card_type: ""
        }
    }
}