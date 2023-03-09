export interface Doctor{
    doctor_id: string,
    name: string,
    consultation_price: number,
    speciality_id: string,
    specialization_id: string,
    teleconsultation_price: number
}

export class Doctor {
    static default(): Doctor {
        return {
            doctor_id: '',
            name: '',
            consultation_price: 0,
            speciality_id: '',
            specialization_id: '',
            teleconsultation_price: 0
        }
    }
}