import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { BehaviorSubject, firstValueFrom, Observable } from "rxjs";
import { PrivilegeAccess } from "../containers/default-layout/_nav";
import { SelectUnitResponse } from "../general/models/response/SelectUnitResponse";
import { RESPONSE_SUCCESS } from "../_configs/app-config";
import { TokenStorageService } from "./token-storage.service";
import { SelectUnitRequest } from "../general/models/request/SelectUnitReq";

const AUTH_API = '/api/connect/token';
const LOGIN_API = '/api/userChannel/wrapperums/login';
const SELECT_UNIT_API = '/api/userChannel/administration/selectUnit';
const LOGOUT_API = '/api/administration/logout';
const LOGOUT_QUEUE_MANAGEMENT_API = '/api/wrappermysiloam/logoutQueueManagement';
const CHANGE_PASSWORD_API = '/api/byPassSecurity/wrapperums/changePassword';
const FORGOT_PASSWORD_API = '/api/byPassSecurity/wrapperums/forgotPassword'

const CLIENT_ID = 'CustomerClient'

const httpOptions = {
  headers : new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded'})
}

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  private privilegeAccessSource = new BehaviorSubject<PrivilegeAccess[]>([]);
  private actionListSource = new BehaviorSubject<string[]>([]);

  privilegeAccess$ = this.privilegeAccessSource.asObservable();
  actionList$ = this.actionListSource.asObservable();

  defaultPrivilege: PrivilegeAccess[] = [
    {
      name: 'Dashboard',
      url: '/dashboard',
      iconComponent: { name: 'cil-speedometer' }
    },
    {
      name: 'Queue Management',
      url: '/queue-management',
      iconComponent: { name: 'cil-layers' }
    },
  ]

  selectUnitResponse!: SelectUnitResponse

  private privilege: PrivilegeAccess[] = []
  actionList: string[] = []
  isPrivilegeAccessAdded: boolean = false

  constructor(private http: HttpClient, private tokenStorage: TokenStorageService) { }

  generateToken(username: string, password: string): Observable<any> {
    password = btoa(password);
    const body = new HttpParams({
      fromObject: {
          username,
          password,
          client_id: CLIENT_ID,
          grant_type: 'password'
      }
  });

    return this.http.post(AUTH_API, body.toString(), httpOptions);
  }

  refreshToken(refreshToken: string): Observable<any> {
    const body = new HttpParams({
      fromObject: {
        grant_type: 'refresh_token',
        client_id: CLIENT_ID,
        refresh_token: refreshToken
      }
    })

    return this.http.post(AUTH_API, body.toString(), httpOptions);
  }

  login(username: string, password: string): Observable<any> {
    password = btoa(password);
    return this.http.post(LOGIN_API, {user_name: username, password});
  }

  selectUnit(req: SelectUnitRequest, headers?: HttpHeaders): Observable<any> {
    return this.http.post(SELECT_UNIT_API, req, { headers: headers });
  }

  changePassword(body: any): Observable<any> {
    return this.http.post(CHANGE_PASSWORD_API, body);
  }

  forgotPassword(body: any): Observable<any> {
    return this.http.post(FORGOT_PASSWORD_API, body);
  }

  logout(user_name: string, full_name: string, user_id: string, organization_id: string): Observable<any> {
    return this.http.post(LOGOUT_API, {user_name, full_name, user_id, organization_id});
  }

  logoutQueueManagement(user_id: string, source: string, user_name: string){
    return this.http.post(LOGOUT_QUEUE_MANAGEMENT_API, {user_id, source, user_name});
  }

  checkUrlPath(privilege_access: PrivilegeAccess[], url: string) {
    for (let i = 0; i < privilege_access.length; i++) {
      let privilege = privilege_access[i];
      if (privilege.url == url) return true;
      if (privilege.children != null && privilege.children != undefined) {
        let hasUrl: boolean = this.checkUrlPath(privilege.children, url);
        if (hasUrl) return true;
      }
    }
    return false;
  }

  addPrivilege(data: PrivilegeAccess[]) {
    this.privilege = []
    this.defaultPrivilege.forEach(dp => {
      this.privilege.push(dp);
    })
    this.mapPrivilege(data, this.privilege);
    this.addActionList(this.privilege);
    this.privilegeAccessSource.next(this.privilege);
    this.actionListSource.next(this.actionList);
    this.isPrivilegeAccessAdded = true
  }

  removePrivilege() {
    this.privilege = []
    this.actionList = []
    this.privilegeAccessSource.next(this.privilege);
    this.actionListSource.next(this.actionList);
  }

  addDefaultPrivilege() {
    this.privilege = [];
    this.defaultPrivilege.map(dp => {
      this.defaultPrivilege.push(dp);
    });
  }

  async getPrivilege() {
    if (this.isPrivilegeAccessAdded == false) {
      let result: SelectUnitResponse = await firstValueFrom(this.selectUnit(SelectUnitRequest.default())).catch((err) => {
        return err;
      });
      if (result.response_code == RESPONSE_SUCCESS) this.tokenStorage.saveUserData(result.psu)
      else result.privileged_access = [] 
      this.addPrivilege(result.privileged_access);
    }
    return this.privilege;
  }

  private mapPrivilege(privileged_access: any[], dst: PrivilegeAccess[]) {
    privileged_access.forEach(p => {
      let privilege: PrivilegeAccess = {}
      privilege.module_id = p.module_id;
      privilege.name = p.module_name;
      privilege.module_type = p.module_type;
      privilege.url = p.module_url;
      privilege.parent_module_id = p.parent_module_id;
      privilege.action_list = p.action_list;
      privilege.children = [];
      privilege.iconComponent = { name: p.fa_icon };
      privilege.attributes = {
        id: p.module_id
      }
      if (privilege.module_type == "MENU_FOLDER" && p.sub_module != null) {
        this.mapPrivilege(p.sub_module, privilege.children);
      }
      dst.push(privilege);
    })
  }

  addActionList(privileged_access: PrivilegeAccess[]) {
    privileged_access.forEach(p => {
      if (p.action_list != null) {
        p.action_list.forEach(a => {
          this.actionList.push(a.action_id!);
        })
      }

      if (p.module_type == "MENU_FOLDER") {
        this.addActionList(p.children!);
      }
    })
  }

  checkAction(actionId: string) {
    return this.actionList.includes(actionId);
  }
}
