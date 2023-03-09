
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MedicalOrder } from '../models/MedicalOrder';

@Component({
  selector: 'app-table-medical-order',
  templateUrl: './table-medical-order.component.html',
  styleUrls: ['./table-medical-order.component.scss']
})
export class TableMedicalOrderComponent implements OnInit {

  loadData: boolean = true
  @Input() dataMedicalOrder: Array<MedicalOrder> = []
  @Input() status: string = ''
  @Output() dataOutput = new EventEmitter<MedicalOrder>()

  constructor() { }

  ngOnInit(): void {
    if(this.dataMedicalOrder.length==0 || this.dataMedicalOrder.length > 0){
      this.loadData = false
    }
  }

  onAddData(data: MedicalOrder){
    this.dataOutput.emit(data)
  }

}
