import { Component, OnInit, Input } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-modal-document-view',
  templateUrl: './modal-document-view.component.html',
  styleUrls: ['./modal-document-view.component.scss']
})
export class ModalDocumentViewComponent implements OnInit {
  @Input() file? : Blob

  constructor(
    public bsModalRef:BsModalRef,
  ) { }

  ngOnInit(): void {
  }

}
