import { GlobalResponse } from "../GlobalResponse";

export interface GetUnavailableDateResponse extends GlobalResponse {
    unavailable_date: string[]
}