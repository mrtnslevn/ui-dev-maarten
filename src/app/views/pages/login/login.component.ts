import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { LoginResponse } from 'src/app/general/models/response/LoginResponse';
import { SelectUnitResponse } from 'src/app/general/models/response/SelectUnitResponse';
import { UserData } from 'src/app/general/models/UserData';
import { ModalAlertService } from 'src/app/service/modal-alert.service';
import { AuthService } from 'src/app/_auth/auth.service';
import { TokenStorageService } from 'src/app/_auth/token-storage.service';
import { ALERT_DANGER, RESPONSE_SUCCESS, RESPONSE_UNAUTHORIZED } from 'src/app/_configs/app-config';
import { SelectUnitRequest } from 'src/app/general/models/request/SelectUnitReq';
import { PropertyCopier } from 'src/app/_helpers/property-copier';
import { HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  public selectUnit : boolean = false;

  loginForm!: FormGroup;
  username: string = ""
  password: string = ""

  selectUnitForm!: FormGroup

  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  roles: string[] = [];
  userData: UserData[] = [];
  userDataSelect: UserData = UserData.default()
  loginFailedMsg = 'Failed to logged in';

  progress: boolean = false;
  bsModalShowAlert?: BsModalRef

  formErrors: any = {
    username: {
      required: 'Username is required',
    },
    password: {
      required: 'Password is required', 
    },
    unit: {
      required: 'Unit is required'
    }
  }

  loginResponse!: LoginResponse

  constructor(private authService: AuthService, private tokenStorage: TokenStorageService, 
    private router: Router, private alertService: ModalAlertService,
    private fb: FormBuilder) { }

  ngOnInit(): void {
    if (this.tokenStorage.getToken()) {
      this.isLoggedIn = true;
      this.roles = this.tokenStorage.getUser().roles;
    }
    this.createLoginForm()
    this.createSelectUniForm()
  }

  loginFormSubmitted: boolean = false
  createLoginForm() {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    })
  }

  resetLoginForm() {
    this.loginForm.reset({username: "", password: ""})
  }

  resetSelectUnit() {
    this.selectUnitForm.reset({unit: ''})
  }

  selectUnitFormSubmitted: boolean = false
  createSelectUniForm() {
    this.selectUnitForm = this.fb.group({
      unit: ['', [Validators.required]]
    })
  }

  get loginFormControls() {
    return this.loginForm.controls
  }

  get selectUnitFormControls() {
    return this.selectUnitForm.controls
  }

  isLoginFormValid(formControlName: string) {
    return { 'is-invalid': this.loginFormSubmitted && this.loginFormControls[formControlName].errors, 
              'is-valid': this.loginFormSubmitted && !this.loginFormControls[formControlName].errors }
  }

  isLoginFormError(formControlName: string) {
    return this.loginFormSubmitted && this.loginFormControls[formControlName].errors;
  }

  getLoginFormErrors(formControlName: string): any {
    return this.loginFormControls[formControlName].errors;
  }

  getFormErrorMessage(formControlName: string, error: any): string {
    return this.formErrors[formControlName][error];
  }

  onChangeUsername(username: string) {
    this.username = username
  }

  onChangePassword(password: string) {
    this.password = password
  }

  onValidateLogin() {
    this.loginFormSubmitted = true
    if (this.loginForm.valid) this.toSelectUnit()
  }

  isSelectUnitFormValid(formControlName: string) {
    return { 'is-invalid': this.selectUnitFormSubmitted && this.selectUnitFormControls[formControlName].errors, 
              'is-valid': this.selectUnitFormSubmitted && !this.selectUnitFormControls[formControlName].errors }
  }

  isSelectUnitFormError(formControlName: string) {
    return this.selectUnitFormSubmitted && this.selectUnitFormControls[formControlName].errors;
  }

  getSelectUnitFormErrors(formControlName: string): any {
    return this.selectUnitFormControls[formControlName].errors;
  }

  toSelectUnit(): void {
    this.progress = true;
    this.tokenStorage.removeToken();
    this.tokenStorage.removeUser();
    this.tokenStorage.removeUserData();
    
    this.authService.generateToken(this.username, this.password).subscribe(
      data => {
        this.tokenStorage.saveToken(data.access_token);
        this.tokenStorage.saveUser(data);
        this.roles = this.tokenStorage.getUser().roles;
        this.doLogin(this.username, this.password);
      },
      err => {
        if (err.status == 400 && err.error.error == RESPONSE_UNAUTHORIZED) {
          this.loginFailed("Invalid Username or Password");
        } else {
          // this.errorMessage = err.error.message;
          this.loginFailed(this.loginFailedMsg);
        }
        this.progress = false;
      }
    );
    // this.router.navigate(['/dashboard'])
  }

  doLogin(username: string, password: string) : void {
    this.authService.login(username, password)
    .subscribe((data: LoginResponse) => {
      this.loginResponse = {...data}
      if (this.loginResponse.response_code == RESPONSE_SUCCESS) {
        if (this.loginResponse.flag_change_password) {
          this.router.navigate(['/change-password',username])
        } else {
          this.userData = this.loginResponse.user_data_list;
          this.selectUnit = !this.selectUnit;
          this.loginSuccess();
        }
      } else {
        this.loginFailed(this.loginFailedMsg)
      }

      this.progress = false;
      },
      err => {
        this.alertService.showModalAlert(`An error has occured, please contact administration`, ALERT_DANGER)
        //this.errorMessage = err.error.message;
        this.loginFailed(this.loginFailedMsg);
        this.progress = false;
      }
    );
  }

  doSelectUnit(userData: UserData) : void { 
    this.userDataSelect = userData;
    // this.tokenStorage.saveUserData(this.userDataSelect);
  }

  onValidateSelectUnit() {
    this.selectUnitFormSubmitted = true
    if (this.selectUnitForm.valid) this.navigateToDashboard()
  }

  navigateToDashboard() : void {
    this.progress = true;

    let req: SelectUnitRequest = SelectUnitRequest.default()
    PropertyCopier.copyProperties(this.userDataSelect, req);
    req.login = true
    let headers: HttpHeaders = new HttpHeaders().set("user_name", this.userDataSelect.user_name)
      .set("role_id", this.userDataSelect.role_id)
      .set("group_id", "x")
      .set("hope_user_id", this.userDataSelect.hope_user_id.toString())
      .set("organization_id", this.userDataSelect.organization_id.toString())
      .set("hope_organization_id", this.userDataSelect.hope_organization_id.toString())
      .set("mobile_organization_id", this.userDataSelect.mobile_organization_id.toString())
      .set("ax_organization_id", this.userDataSelect.ax_organization_id.toString())
      .set("full_name", this.userDataSelect.full_name)
      .set("role_name", this.userDataSelect.role_name)
      .set("organization_name", this.userDataSelect.organization_name)
      .set("user_id", this.userDataSelect.user_id)

    if (this.userDataSelect.email != undefined) headers = headers.set("email", this.userDataSelect.email)
    if (this.userDataSelect.handphone != undefined) headers = headers.set("handphone", this.userDataSelect.handphone!)

    this.authService.selectUnit(req, headers).subscribe((data: SelectUnitResponse) => {
      if(data.response_code == RESPONSE_SUCCESS){
        this.authService.addPrivilege(data.privileged_access);
        this.userDataSelect.npwp = data.npwp
        this.tokenStorage.saveUserData(data.psu)
        // this.tokenStorage.saveUserData(this.userDataSelect)
        this.tokenStorage.saveSessionTimeout(data.session_timeout)
        this.router.navigate(['/dashboard']);
      }else{
        this.selectUnit = false;
        this.loginFailed(data.response_desc!);
      }
      this.progress = false;
    },
    err => {
      this.alertService.showModalAlert(`An error has occured while , please contact administration`, ALERT_DANGER)
      //this.errorMessage = err.error.message;
      this.loginFailed(this.loginFailedMsg);
      this.progress = false;
    });
  }

  resetLoginAndSelectUnit() {
    this.username = ""
    this.password = ""
    this.loginFormSubmitted = false
    this.resetLoginForm()
    this.userDataSelect = UserData.default()
    this.selectUnitFormSubmitted = false
    this.resetSelectUnit()
  }

  loginSuccess() {
    this.isLoginFailed = false;
    this.isLoggedIn = true;
    this.resetLoginAndSelectUnit()
  }

  loginFailed(errorMessage: string) {
    this.isLoginFailed = true;
    this.errorMessage = errorMessage;
    this.tokenStorage.removeToken();
    this.tokenStorage.removeUser();
    this.tokenStorage.removeUserData();
    this.selectUnit = false;
    this.resetLoginAndSelectUnit()
  }

  isError() {
    return this.isLoginFailed && this.errorMessage != '';
  }

  toForgotPassword(){
    this.router.navigate(['forget-password']);
  }
}
