import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Document } from '../../models/Document';
@Component({
  selector: 'app-card-document',
  templateUrl: './card-document.component.html',
  styleUrls: ['./card-document.component.scss']
})
export class CardDocumentComponent implements OnInit {
  @Input() title:string = '';
  @Input() documents: File[] = []
  @Input() showUploadForm:boolean = true;

  @Output() onUploadDocument: EventEmitter<Document> = new EventEmitter()
  @Output() onDeleteDocument: EventEmitter<Document> = new EventEmitter()
  @Output() onViewDocument: EventEmitter<any> = new EventEmitter()
  
  constructor() { }

  ngOnInit(): void {
  }

  onDelete(document: File) {
    // this.onDeleteDocument.emit(document)
  }

  onView(document: File) {
    this.onViewDocument.emit(document)
  }
  onUpload(event:any) {
    const file:File = event.target.files[0];
    this.documents.push(file)
    console.log(this.documents)
    this.onUploadDocument.emit(event.target.files)
  }

}
