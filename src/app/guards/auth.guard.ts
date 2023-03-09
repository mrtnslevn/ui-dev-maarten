import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterModule, RouterState, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { PrivilegeAccess } from '../containers/default-layout/_nav';
import { AuthService } from '../_auth/auth.service';
import { TokenStorageService } from '../_auth/token-storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild {

  constructor(
    private router: Router,
    private authService: AuthService,
    private tokenStorage: TokenStorageService) { }

  async canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    return await this.validate(childRoute, state)
  }
  
  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    return await this.validate(route, state)
  }

  async validate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    let data: PrivilegeAccess[] = await this.authService.getPrivilege();
    let action_list: string[] = this.authService.actionList

    let token = this.tokenStorage.getToken()
    let user = this.tokenStorage.getUserDataJwt();
    let isLoggedIn: boolean = token != null && user != null ? true : false;

    if (isLoggedIn) {
      let hasPrivilege: boolean = this.checkUrl(data, state.url);

      if (!hasPrivilege) {
        let action: string = route.data["action"]
        if (action != undefined) return this.checkAction(action_list, action)
        
        this.router.navigateByUrl("/dashboard");
        return false
      }
      return true;
    }

    this.router.navigateByUrl("/login")
    return false;
  }

  checkUrl(privilege: PrivilegeAccess[], url: string) {
    const filtered: PrivilegeAccess | undefined = this.getPrivilege(privilege, url);
    return filtered != undefined ? true : false
  }

  checkAction(actionList: string[], actionId: string) {
    return actionList.includes(actionId)
  }

  getPrivilege(privilege: PrivilegeAccess[], url: string) {
    let filtered: PrivilegeAccess | undefined;

    for (let i = 0; i < privilege.length; i++) {
      let p = privilege[i];
      if (p.url == url) {
        filtered = p;
        break;
      }

      if (p.module_type == "MENU_FOLDER" && p.children != null) {
        filtered = this.getPrivilege(p.children, url);
        if (filtered != undefined) break; 
      }
    }

    return filtered;
  }
}
