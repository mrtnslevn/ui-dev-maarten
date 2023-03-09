import { OrderedItem } from "./OrderedItem";

export interface OrderedItemType {
  sales_item_type_id: number,
  sales_item_type_name: string;
  email_to_enabled: string;
  email_to: string;
  is_item_issue: string;
  sales_item_list: OrderedItem[];
  checked?: boolean;
}

export class OrderedItemType {
  static default() {
    return {
      sales_item_type_id: 0,
      sales_item_type_name: "",
      email_to_enabled: "",
      email_to: "",
      is_item_issue: "",
      sales_item_list: OrderedItem.defaultArray(),
    }
  }

  static defaultArray(): OrderedItemType[] {
    return [this.default()];
  }
}
