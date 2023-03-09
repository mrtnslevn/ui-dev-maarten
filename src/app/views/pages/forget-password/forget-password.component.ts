import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ModalAlertService } from 'src/app/service/modal-alert.service';
import { AuthService } from 'src/app/_auth/auth.service';
import { ALERT_DANGER, ALERT_SUCCESS, RESPONSE_SUCCESS } from 'src/app/_configs/app-config';
import { ValidationFormsService } from './validation-forms.service';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.scss']
})
export class ForgetPasswordComponent implements OnInit {

  progress: boolean = false
  forgotPasswordForm!: FormGroup
  submitted: boolean = false
  formErrors: any;
  getForgotPasswordResponse: any

  bsModalShowAlert?: BsModalRef

  constructor(private authService: AuthService, private router: Router,
    private fb: FormBuilder, private vf: ValidationFormsService,
    private alertService: ModalAlertService) {
      this.formErrors = this.vf.errorMessages;
      this.createForm();
     }

  ngOnInit(): void {
    
  }

  createForm() {
    this.forgotPasswordForm = this.fb.group({
        user_name: ['', [Validators.required]],
        email: ['',[Validators.required],
        ],
      },
    );
  }

  isFormValid(formName: string) {
    return { 'is-invalid': this.submitted && this.f[formName].errors, 
              'is-valid': this.submitted && !this.f[formName].errors }
  }

  isFormError(formName: string) {
    return this.submitted && this.f[formName].errors;
  }

  getErrors(formName: string) {
    return this.f[formName].errors;
  }

  getErrorMessage(formName: string, error: any) {
    return this.formErrors[formName][error];
  }

  get f() {
    return this.forgotPasswordForm.controls;
  }

  onValidate() {
    this.submitted = true
    // stop here if form is invalid
    if(this.forgotPasswordForm.valid){
      this.onClickSend()
    }
  }

  onClickSend(){
    this.progress = true
    const body = {
      user_name: this.forgotPasswordForm.controls['user_name'].value,
      email: this.forgotPasswordForm.controls['email'].value
    }

    return this.authService.forgotPassword(body)
    .subscribe((data)=>
    {
      this.getForgotPasswordResponse = {...data};
      if(this.getForgotPasswordResponse.response_code === RESPONSE_SUCCESS) {
        this.alertService.showModalAlert("Forget Password Request has been sent to your email",ALERT_SUCCESS)
        this.router.navigate(['/login'])
      }else{
        this.alertService.showModalAlert(`Failed to get request: ${this.getForgotPasswordResponse.response_desc}`,ALERT_DANGER) 
      }
      this.progress = false
    }, err => {
      this.alertService.showModalAlert(`An error has occured while get request, please contact administration`, ALERT_DANGER)
      this.progress = false
    });
  }

}
