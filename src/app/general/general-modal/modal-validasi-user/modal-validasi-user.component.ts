import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { GeneralService } from 'src/app/service/general.service';
import { ModalAlertService } from 'src/app/service/modal-alert.service';
import { AuthService } from 'src/app/_auth/auth.service';
import { TokenStorageService } from 'src/app/_auth/token-storage.service';
import { ALERT_WARNING, RESPONSE_SUCCESS } from 'src/app/_configs/app-config';
import { UserValidationFormsService } from './validation-forms.service';

@Component({
  selector: 'app-modal-validasi-user',
  templateUrl: './modal-validasi-user.component.html',
  styleUrls: ['./modal-validasi-user.component.scss']
})
export class ModalValidasiUserComponent implements OnInit {

  @Output() isUserValid = new EventEmitter<boolean>()
  formErrors: any;
  userForm!: FormGroup
  submitted: boolean = false

  userId: string = ""
  password: string = ""
  needPassword: boolean = false
  org_id: number = 0

  progress: boolean = false
  disabledCloseButton: boolean = false
  userDataList: any[] = []

  bsModalShowAlert?: BsModalRef

  constructor(public bsModalRef: BsModalRef, private generalService: GeneralService,
    private token: TokenStorageService,
    private fb: FormBuilder,
    public vf: UserValidationFormsService,
    private authService: AuthService,
    private alertService: ModalAlertService) {
      this.formErrors = this.vf.errorMessages;
      this.createForm();
    }

  ngOnInit(): void {
    const userData = this.token.getUserData();
    this.userId = userData.user_name
    this.org_id = userData.hope_organization_id;
  }

  createForm() {
    this.userForm = this.fb.group({
      userId: [''],
      password: ['', Validators.required ],
    });
  }

  get f() {
    return this.userForm.controls;
  }

  onChangeUserId(e: any){
    this.userId = e
  }

  onChangePassword(e: any){
    this.password = e
  }

  onValidate(){
    this.submitted = true;
    if(this.userForm.status === 'VALID'){
      this.cekDataApprover()
    }
  }

  cekDataApprover(){
    this.progress = true
    this.disabledCloseButton = true
    this.authService.login(this.userId, this.password).subscribe(
      data => {
        if (data.response_code == RESPONSE_SUCCESS) {
          this.userDataList = data.user_data_list
          this.userDataList = this.userDataList.filter((x: { hope_organization_id: any; }) => x.hope_organization_id == this.org_id)
          if(this.userDataList){
            this.isUserValid.emit(true)
          }else{
            this.isUserValid.emit(false)
          }
          this.bsModalRef.hide()
        }else{
          this.alertService.showModalAlert("Authentication for approver is failed",ALERT_WARNING)
        }
        this.progress = false
        this.disabledCloseButton = false
      },err => {
        this.alertService.showModalAlert("Authentication for approver is failed, please contact administration",ALERT_WARNING)
        this.progress = false
        this.disabledCloseButton = false
      }
    );
  }

}
