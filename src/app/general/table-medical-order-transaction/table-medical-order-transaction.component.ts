import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PropertyCopier } from 'src/app/_helpers/property-copier';
import { MedicalOrder } from '../models/MedicalOrder';
import { MedicalOrderTransaction } from '../models/MedicalOrderTransaction';
import { SalesItem } from '../models/SalesItem';

@Component({
  selector: 'app-table-medical-order-transaction',
  templateUrl: './table-medical-order-transaction.component.html',
  styleUrls: ['./table-medical-order-transaction.component.scss']
})
export class TableMedicalOrderTransactionComponent implements OnInit {

  loadData: boolean = true
  @Input() dataMedicalOrderTransaction: Array<MedicalOrderTransaction> = []
  @Input() status: string = ''
  @Output() dataOutput = new EventEmitter<MedicalOrderTransaction[]>()
  @Input() data: MedicalOrderTransaction[] = []

  dataToSent: MedicalOrderTransaction[] = []

  public salesItem: SalesItem[] = []


  constructor() { }

  ngOnInit(): void {
    this.loadData = true;
  }

  medicalOrderTransactionListChangeRadio(d: any, e: any): void { 
    this.dataMedicalOrderTransaction[this.dataMedicalOrderTransaction.indexOf(d)].checked = e.target.checked;
    this.dataToSent = this.dataMedicalOrderTransaction.filter(d => d.checked)
    this.dataOutput.emit(this.dataToSent)
  }

  medicalOrderTransactionSelectAll(e: any): void {
    this.dataMedicalOrderTransaction.forEach((i: any) => {
      if(i.sales_item_id!=0){
        i.checked = e.target.checked;
        this.dataToSent.push(i)
      }
    });
    this.dataOutput.emit(this.dataToSent)
  }

}
