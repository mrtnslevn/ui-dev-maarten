import { ElementRef, Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class PaymentQuerySelectorService {
    element!: ElementRef<any>;
    inputs: any[] = [];

    private listInputId: string[] = ["btn-export-combined-bill", "btn-export-ordered-item"];

    constructor() { }

    disableInputs() {
        this.queryInputs();
        this.inputs.forEach(input => {
            if (!this.listInputId.includes(input.id)) {
              input.disabled = true;
            }
        });
    }
    queryInputs() {
        const app = this.element.nativeElement;
        const apps: any = {
            appSearchBill: app.querySelector("#searchBill"),
            appCombinedBill: app.querySelector("app-card-combined-bill"),
            appPatientInfo: app.querySelector("app-card-patient-info"),
            appOrderedItem: app.querySelector("app-card-ordered-item"),
            appSalesDiscount: app.querySelector("app-card-input-sales-discount"),
            appInvoice: app.querySelector("app-card-invoice")
        }
    
        for (const app in apps) {
            if (apps[app] != null && apps[app] != undefined)
            {
                const inputs: any[] = apps[app].querySelectorAll("input");
                const selects: any[] = apps[app].querySelectorAll("select");
                const buttons: any[] = apps[app].querySelectorAll("button");
            
                inputs.forEach(input => {
                    this.inputs.push(input);
                });
                selects.forEach(select => {
                    this.inputs.push(select);
                })
                buttons.forEach(button => {
                    this.inputs.push(button);
                })
            }
            
        }
    }
}