import { GlobalResponse } from "../GlobalResponse";
import { CovidTestingType } from "../CovidTestingType";

export interface GetCovidTestingTypeResponse extends GlobalResponse{
   covid_testing_type_list: CovidTestingType[]
}