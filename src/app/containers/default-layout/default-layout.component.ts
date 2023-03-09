import { AfterViewInit, Component, ElementRef, NgZone, OnDestroy, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { BnNgIdleService } from 'bn-ng-idle';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ModalAlertService } from 'src/app/service/modal-alert.service';
import { AuthService } from 'src/app/_auth/auth.service';
import { TokenStorageService } from 'src/app/_auth/token-storage.service';
import { ALERT_DANGER, ALERT_WARNING, RESPONSE_SUCCESS } from 'src/app/_configs/app-config';
import { DEFAULT_INTERRUPTSOURCES, Idle } from '@ng-idle/core';

import { navItems, PrivilegeAccess } from './_nav';
import { Subscription, firstValueFrom } from 'rxjs';
import { LogoutResponse } from 'src/app/general/models/LogoutResponse';
import { LogoutQueueManagementResponse } from 'src/app/general/models/LogoutQueueManagementResponse';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html',
})
export class DefaultLayoutComponent implements AfterViewInit, OnDestroy {

  public navItems = navItems;

  public perfectScrollbarConfig = {
    suppressScrollX: true,
  };

  nama: string = "";
  session_timeout: number = 0
  defaultIdle: boolean = false
  bsModalShowAlert!: BsModalRef

  privilege: PrivilegeAccess[] = []
  private numberOfSeconds: number = 5;

  @ViewChild("cSidebarNav", {read: ElementRef}) cSidebarNav!: ElementRef

  idleStart!: Subscription
  idleTimeout!: Subscription

  logoutQueueManagementResponse!: LogoutQueueManagementResponse
  logoutResponse!: LogoutResponse

  constructor(private tokenService: TokenStorageService, private bnIdle: BnNgIdleService,
    private authService: AuthService, private router: Router,
    private alertService: ModalAlertService, private _idle: Idle,
    private zone: NgZone) {
      this.authService.privilegeAccess$.subscribe((data: PrivilegeAccess[]) => {
        this.privilege = data
      })
  }

  ngOnInit(): void {
    this.defaultIdle = true
    this.nama= this.tokenService.getUserData().full_name;
    this.session_timeout = this.tokenService.getSessionTimeout() * 60

    this._idle.setIdle(this.numberOfSeconds);
    this._idle.setTimeout(this.session_timeout);
    this._idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);

    this.idleStart = this._idle.onIdleStart.subscribe(() => {
    // show the modal
      
    });

    this.idleTimeout = this._idle.onTimeout.subscribe(() => {
      this.alertService.showModalAlert('Session expired, please re-login',ALERT_WARNING)
      this._idle.stop()
      this.logout()
      this.unsubscribeIdle()
    });

    this._idle.watch()
    // this.bnIdle.startWatching(this.session_timeout).subscribe((isTimedOut: boolean) => {
    //   if (isTimedOut && this.defaultIdle) {
    //     
    //     this.alertService.showModalAlert('Session expired, please re-login',ALERT_WARNING)
    //     this.logout()
    //     this.bnIdle.stopTimer()
    //   }
    // });
  }


  ngAfterViewInit() {
    let cSidebarNavGroup: any[] = this.cSidebarNav.nativeElement.querySelectorAll("c-sidebar-nav-group")
    for (let i = 0; i < cSidebarNavGroup.length; i++) {
      (function() {
        let sidebarNav = cSidebarNavGroup[i]
        sidebarNav.addEventListener("click", function() { 
          let sidebarNavid = sidebarNav.querySelector("a").id
          if (sidebarNav.classList.contains("show")) {
            for (let j = 0; j < cSidebarNavGroup.length; j++) {
              let nav = cSidebarNavGroup[j].querySelector("a");
              if (cSidebarNavGroup[j].classList.contains("show") && nav.id != sidebarNavid) {
                cSidebarNavGroup[j].classList.remove("show")
                nav.click()
              }
            }
          }
        })
      })()
    }
  }

  ngOnDestroy() {
    this.defaultIdle = false;
    this._idle.stop()
    this.unsubscribeIdle()
  }

  async logout() {
    const userData = this.tokenService.getUserData();
    const user_name = userData.user_name;
    const full_name = userData.full_name;
    const user_id = userData.user_id;
    const organization_id = userData.organization_id;
    const source = 'CASHIER-PAYMENT-SYSTEM';

    await firstValueFrom(this.authService.logoutQueueManagement(user_id, source, full_name))
    .then((data: LogoutQueueManagementResponse) => {
      this.logoutQueueManagementResponse = {...data}
      if (this.logoutQueueManagementResponse.response_code == RESPONSE_SUCCESS) {

      } else {
        this.alertService.showModalAlertError("Failed to logout queue management, please contact the administrator")
      }
    }, (err: HttpErrorResponse) => {
      this.alertService.showModalAlertError('Failed to logout queue management, please contact the administrator')
    })

    await firstValueFrom(this.authService.logout(user_name, full_name, user_id, organization_id))
    .then((data: LogoutResponse) => {
      this.logoutResponse = {...data}
      if (this.logoutResponse.response_code == RESPONSE_SUCCESS) {

      } else {
        this.alertService.showModalAlert('Failed to logout, please try again',ALERT_DANGER)
      }

    }, (err: HttpErrorResponse) => {
      this.alertService.showModalAlert('Failed to logout, please try again',ALERT_DANGER)
    })

    this.zone.run(() => this.router.navigate(['/login']))
    this.tokenService.removeToken();
    this.tokenService.removeUserData();
    this.tokenService.removeUser();
    this.authService.removePrivilege()
  }

  unsubscribeIdle() {
    this.idleStart.unsubscribe()
    this.idleTimeout.unsubscribe()
  }
}
