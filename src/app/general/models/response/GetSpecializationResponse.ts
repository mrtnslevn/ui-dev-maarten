import { GlobalResponse } from "../GlobalResponse";
import { Specialization } from "../Specialization";

export interface GetSpecializationResponse extends GlobalResponse{
   specialist_list: Specialization[]
}