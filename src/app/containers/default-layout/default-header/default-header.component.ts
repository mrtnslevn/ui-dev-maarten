import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

import { HeaderComponent } from '@coreui/angular';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ModalAlertService } from 'src/app/service/modal-alert.service';
import { AuthService } from 'src/app/_auth/auth.service';
import { TokenStorageService } from 'src/app/_auth/token-storage.service';
import { ALERT_DANGER, RESPONSE_SUCCESS } from 'src/app/_configs/app-config';
import { firstValueFrom } from 'rxjs';
import { LogoutQueueManagementResponse } from 'src/app/general/models/LogoutQueueManagementResponse';
import { LogoutResponse } from 'src/app/general/models/LogoutResponse';
import { HttpErrorResponse } from '@angular/common/http';
import { UserData } from 'src/app/general/models/UserData';

@Component({
  selector: 'app-default-header',
  templateUrl: './default-header.component.html',
})
export class DefaultHeaderComponent extends HeaderComponent {

  @Input() sidebarId: string = "sidebar";
  @Input() nama: string = "username";

  public newMessages = new Array(4)
  public newTasks = new Array(5)
  public newNotifications = new Array(5)

  bsModalShowAlert!: BsModalRef
  bsModalAlertLogout!: BsModalRef

  loadingLogout: boolean = false

  logoutQueueManagementResponse!: LogoutQueueManagementResponse
  logoutResponse!: LogoutResponse

  constructor(
      private authService: AuthService,
      private tokenStorage: TokenStorageService,
      private router: Router,
      private bsModalService: BsModalService,
      private alertService: ModalAlertService
    ) {
    super();
  }

  async logoutQueueManagement(userData: UserData) {
    const source = 'CASHIER-PAYMENT-SYSTEM'
    await firstValueFrom(this.authService.logoutQueueManagement(userData.user_id, source, userData.full_name))
    .then((data: LogoutQueueManagementResponse) => {
      this.logoutQueueManagementResponse = {...data}
      if (this.logoutQueueManagementResponse.response_code == RESPONSE_SUCCESS) {
        this.doLogout(userData)
      } else {
        this.alertService.showModalAlertError("Failed to logout queue management, please contact the administrator")
        this.loadingLogout = false
      }
    }, (err: HttpErrorResponse) => {
      this.alertService.showModalAlertError('Failed to logout queue management, please contact the administrator')
      this.loadingLogout = false
    })
  }

  async doLogout(userData: UserData) {
    await firstValueFrom(this.authService.logout(
      userData.user_name, userData.full_name, userData.user_id, userData.hope_organization_id.toString()))
    .then((data: LogoutResponse) => {
      this.logoutResponse = {...data}
      if (this.logoutResponse.response_code == RESPONSE_SUCCESS) {
        this.router.navigate(['/login'])
        this.tokenStorage.removeToken();
        this.tokenStorage.removeUserData();
        this.tokenStorage.removeUser();
        this.authService.removePrivilege()
      } else {
        this.alertService.showModalAlert('Failed to logout, please try again',ALERT_DANGER)
      }
      this.loadingLogout = false
    }, (err: HttpErrorResponse) => {
      this.alertService.showModalAlert('Failed to logout, please try again',ALERT_DANGER)
      this.loadingLogout = false
    })
  }

  

  async logout() {
    this.loadingLogout = true;

    const userData = this.tokenStorage.getUserData();
    await this.logoutQueueManagement(userData)
  }
}
