import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

import { IconSetService } from '@coreui/icons-angular';
import { iconSubset } from './icons/icon-subset';
import { Title } from '@angular/platform-browser';

import { PrivilegeAccess } from './containers/default-layout/_nav';
import { AuthService } from './_auth/auth.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'body',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  title = 'Siloam Payment System';
  loadPage: boolean = false;

  // Context variable
  privilege: PrivilegeAccess[] = [];
  action_list: string[] = [];

  constructor(
    private router: Router,
    private titleService: Title,
    private iconSetService: IconSetService,
    private authService: AuthService,
  ) {
    titleService.setTitle(this.title);
    // iconSet singleton
    iconSetService.icons = { ...iconSubset };

    this.authService.privilegeAccess$.subscribe((value: PrivilegeAccess[]) => {
      this.privilege = value;
    })
    this.authService.actionList$.subscribe((value: string[]) => {
      this.action_list = value;
    })

  }

  ngOnInit(): void {
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
    });
  }

  // Context method
  // ! Make sure the method is callback like example below
  addPrivilege = (privilege: PrivilegeAccess[]) => {
    this.authService.addPrivilege(privilege);
  }

  removePrivilege = () => {
    this.authService.removePrivilege();
  }

  checkAction = (actionId: string) => {
    return this.authService.checkAction(actionId)
  }
}
