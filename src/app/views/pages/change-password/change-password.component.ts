import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators,} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalRef} from 'ngx-bootstrap/modal';
import { GetChangePasswordResponse } from 'src/app/general/models/response/GetChangePasswordResponse';
import { ModalAlertService } from 'src/app/service/modal-alert.service';
import { AuthService } from 'src/app/_auth/auth.service';
import { ALERT_DANGER, ALERT_SUCCESS, RESPONSE_SUCCESS } from 'src/app/_configs/app-config';
import { ValidationFormsService } from './validation-forms.service';

export function confirmPasswordValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const password = control.parent?.get("new_password")?.value;
    // const confirm_password = control.parent?.get("confirm_password")?.value;
    return control.value == password ? null : { password_mismatch: true }
  }
}

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
  providers: [ValidationFormsService]
})

export class ChangePasswordComponent implements OnInit {
  getParams: any
  username: string = ''
  progress: boolean = false

  changePasswordForm!: FormGroup;
  submitted = false;
  formErrors: any;
  message = "Default Password detected. please change your password immediately!"
  getChangePasswordResponse: any

  bsModalShowAlert?: BsModalRef

  constructor(private fb: FormBuilder, private vf: ValidationFormsService,
    private authService: AuthService, private router: Router, private route: ActivatedRoute,
    private alertService: ModalAlertService) {
      this.formErrors = this.vf.errorMessages;
      this.createForm();
    }

  ngOnInit(): void {
    this.getParams = this.route.params.subscribe(params => {
      this.username = params['username'];
    })
  }

  createForm() {
    this.changePasswordForm = this.fb.group({
        old_password: ['', []],
        new_password: [
          '',
          [
            Validators.required,
            Validators.minLength(this.vf.formRules.passwordMin),
            Validators.pattern(this.vf.formRules.passwordPattern),
          ],
        ],
        confirm_password: ['', [Validators.required, confirmPasswordValidator()]],
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
    return this.changePasswordForm.controls;
  }

  onChangeOldPassword(){
    this.f["old_password"].updateValueAndValidity()
  }

  onChangeNewPassword(){
    this.f["new_password"].updateValueAndValidity()
  }

  onChangeConfirmPassword(){
    this.f["confirm_password"].updateValueAndValidity()
  }

  onValidate() {
    this.submitted = true
    // stop here if form is invalid
    if(this.changePasswordForm.valid){
      this.onClickChangePassword()
    }
  }
  
  onClickChangePassword(){
    this.progress = true
    const body = {
      user_name: this.username,
      old_pass: btoa(this.changePasswordForm.controls['old_password'].value),
      new_pass: btoa(this.changePasswordForm.controls['new_password'].value),
      modified_by: this.username,
    }

    return this.authService.changePassword(body)
      .subscribe((data: GetChangePasswordResponse)=>
      {
        this.getChangePasswordResponse = {...data};
        if(this.getChangePasswordResponse.response_code === RESPONSE_SUCCESS) {
          this.alertService.showModalAlert("Password is successfully changed",ALERT_SUCCESS)
          this.router.navigate(['/login'])
        }else{
          this.alertService.showModalAlert(`Failed to change password: ${this.getChangePasswordResponse.response_desc}`,ALERT_DANGER)
        }
        this.progress = false
      }, err => {
        this.alertService.showModalAlert(`An error has occured while change password, please contact administration`, ALERT_DANGER)
        this.progress = false
      });
  }
}
