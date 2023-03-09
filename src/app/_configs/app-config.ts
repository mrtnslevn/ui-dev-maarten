export const RESPONSE_SUCCESS = "00";
export const RESPONSE_EXCEPTION = "99";
export const RESPONSE_DOUBLE_LOGIN = "02";
export const RESPONSE_TOKEN_EXPIRED = "95";
export const RESPONSE_UNAUTHORIZED = "unauthorized_client";

export const BASE_URL = "/api";

export const MCU = "1";
export const COVID_TESTING = "2";
export const OPD = "3";

export const SALES_ITEM_TYPE_CONSULTATION = 1;
export const SALES_ITEM_TYPE_LABORATORY = 2;
export const SALES_ITEM_TYPE_RADIOLOGY = 3;
export const SALES_ITEM_TYPE_DIAGNOSTIC = 4;
export const SALES_ITEM_TYPE_PROCEDURE = 5;
export const SALES_ITEM_TYPE_EQUIPMENT = 9;
export const SALES_ITEM_TYPE_OTHERSERVICE = 10;
export const SALES_ITEM_TYPE_ADMINCHARGE = 11;
export const SALES_ITEM_TYPE_CHECKUP = 12;
export const SALES_ITEM_TYPE_BED = 13;
export const SALES_ITEM_TYPE_PROCEDUREROOM = 14;
export const SALES_ITEM_TYPE_SURGEON = 15;
export const SALES_ITEM_TYPE_ANESTHETIST = 16;
export const SALES_ITEM_TYPE_PACKAGE = 17;
export const SALES_ITEM_TYPE_DRUG = 6;
export const SALES_ITEM_TYPE_CONSUMABLE = 7;
export const SALES_ITEM_TYPE_OTHERITEM = 8;

export const SERVICE_SALES_ITEM_TYPE = [SALES_ITEM_TYPE_CONSULTATION,
    SALES_ITEM_TYPE_LABORATORY, SALES_ITEM_TYPE_RADIOLOGY, 
    SALES_ITEM_TYPE_DIAGNOSTIC, SALES_ITEM_TYPE_PROCEDURE,
    SALES_ITEM_TYPE_EQUIPMENT, SALES_ITEM_TYPE_OTHERSERVICE,
    SALES_ITEM_TYPE_ADMINCHARGE, SALES_ITEM_TYPE_CHECKUP,
    SALES_ITEM_TYPE_BED, SALES_ITEM_TYPE_PROCEDUREROOM,
    SALES_ITEM_TYPE_SURGEON, SALES_ITEM_TYPE_ANESTHETIST
]
export const ITEM_ISSUE_SALES_ITEM_TYPE = [SALES_ITEM_TYPE_OTHERITEM, 
    SALES_ITEM_TYPE_CONSUMABLE, SALES_ITEM_TYPE_DRUG]
export const PACKAGE_SALES_ITEM_TYPE = [SALES_ITEM_TYPE_PACKAGE]
export const END_DATE_SALES_ITEM_TYPE = [SALES_ITEM_TYPE_EQUIPMENT, SALES_ITEM_TYPE_PROCEDUREROOM]

export const ALERT_DANGER='danger'
export const ALERT_WARNING='warning'
export const ALERT_SUCCESS='success'
export const ALERT_INFO='info'
export const SALES_ITEM_CATEGORY_ITEM_ISSUE = '1'

export const DEPOSITIPD = 'deposit'
export const PREPAID = 'prepaid'

export const DEPOSIT_IPD_REFUND = 'deposit-ipd-refund'
export const PREPAID_REFUND = 'prepaid-refund'

