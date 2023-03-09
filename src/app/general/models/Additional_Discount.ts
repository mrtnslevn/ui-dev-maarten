export interface AdditionalDiscount{
    disc_factor: number;
    disc_type_id: number;
    disc_type_name: string;
    notes: string;
    ordered_item_id: number;
    ordered_item_name: string;
    portion_type_id: number;
    portion_type_name: string;
    sales_item_group_id: number;
    sales_item_group_name: string;
    sales_item_type_id: number;
    sales_item_type_name: string;
    sales_item_id: number;
    sales_item_name: string;
    transaction_level_id: number;
    transaction_level_name: string;
    checked?: boolean;
}

export class AdditionalDiscount {
    static default(): AdditionalDiscount {
        return {
            disc_factor: 0,
            disc_type_id: 0,
            disc_type_name: '',
            notes: '',
            ordered_item_id: 0,
            ordered_item_name: '',
            portion_type_id: 0,
            portion_type_name: '',
            sales_item_group_id: 0,
            sales_item_group_name: '',
            sales_item_type_id: 0,
            sales_item_type_name: '',
            sales_item_id: 0,
            sales_item_name: '',
            transaction_level_id: 0,
            transaction_level_name: ''
          }
    }
}

export interface CustomAdditionalDiscount {
    disc_transaction_level_id: number,
    sales_item_type_id?: number,
    sales_item_type_name?: string,
    sales_item_group_id?: number,
    sales_item_group_name?: string,
    sales_item_id?: number,
    sales_item_name?: string,
    ordered_item_id?: number,
    ordered_item_name?: string,
    portion_type_id: number,
    disc_type_id: number,
    disc_factor: number,
    notes?: string
}