import { Component, OnInit, ViewChild, ElementRef, isDevMode } from '@angular/core';
import { TokenStorageService } from 'src/app/_auth/token-storage.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-queue-management',
  templateUrl: './queue-management.component.html',
  styleUrls: ['./queue-management.component.scss']
})
export class QueueManagementComponent implements OnInit {

  public linkUrl: string = ``;

  @ViewChild('iframe') iframe!: ElementRef;
  isCashierOnly: boolean = true
  isIframe: boolean = true
  userId: string = ''
  fullName: string = ''
  hospitalId: string = ''
  source: string = 'CASHIER-PAYMENT-SYSTEM'

  ngOnInit() {
    const userData = this.token.getUserData();
    

    this.userId = userData.user_id;
    this.fullName = userData.full_name;
    this.hospitalId = userData.mobile_organization_id;
    // this.linkUrl = 'https://gtn-myslm-uat-fe1.siloamhospitals.com/fo-single-queue/queue-call-iframe?iframe=true&userId=af16b0ea-fde4-4af1-be9c-ea3f30d8e5ac&fullName=Vincent%20Coa&hospitalId=39764039-37b9-4176-a025-ef7b2e124ba4&source=CASHIER-PAYMENT-SYSTEM&isCashierOnly=true'
    this.linkUrl = `${environment.queueManagementUrl}?iframe=${this.isIframe}&userId=${this.userId}&fullName=${this.fullName}&hospitalId=${this.hospitalId}&source=${this.source}&isCashierOnly=${this.isCashierOnly}`
  }
  
  ngAfterViewInit() {
   const doc = this.iframe.nativeElement.contentDocument || this.iframe.nativeElement.contentElement.contentWindow;
   const content = `
       <html>
       <head>
         <base target="_parent">
       </head>
       <body>
       <script type="text/javascript" src="${this.linkUrl}"></script>
       </body>
     </html>
   `;

   doc.open();
   doc.write(content);
   doc.close();
  }

  constructor(private token: TokenStorageService,) { }
}
