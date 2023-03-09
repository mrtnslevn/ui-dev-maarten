import { Injectable } from '@angular/core';
const TOKEN_KEY = 'auth-token';
const USER_KEY = 'auth-user';
const USER_DATA_KEY = 'psu';

@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {
  constructor() { }
  signOut(): void {
    window.sessionStorage.clear();
  }
  public saveToken(token: string): void {
    window.sessionStorage.removeItem(TOKEN_KEY);
    window.sessionStorage.setItem(TOKEN_KEY, token);
  }
  public getToken(): string | null {
    return window.sessionStorage.getItem(TOKEN_KEY);
  }

  public removeToken(): void {
    window.sessionStorage.removeItem(TOKEN_KEY);
  }

  public saveUser(user: any): void {
    window.sessionStorage.removeItem(USER_KEY);
    window.sessionStorage.setItem(USER_KEY, JSON.stringify(user));
  }
  public getUser(): any {
    const user = window.sessionStorage.getItem(USER_KEY);
    if (user) {
      return JSON.parse(user);
    }
    return {};
  }

  public removeUser(): void {
    window.sessionStorage.removeItem(USER_KEY);
  }

  public saveSessionTimeout(sessionTimeout: any): void {
    window.sessionStorage.removeItem('session-timeout');
    window.sessionStorage.setItem('session-timeout', sessionTimeout);
  }

  public getSessionTimeout(): any {
    const session_timeout = window.sessionStorage.getItem('session-timeout');
    if (session_timeout) {
      return session_timeout;
    }
    return null;
  }

  public saveUserData(userData: string): void {
    window.sessionStorage.removeItem(USER_DATA_KEY);
    window.sessionStorage.setItem(USER_DATA_KEY, userData);
  }

  public getUserData(): any {
    const user = window.sessionStorage.getItem(USER_DATA_KEY);

    if (user) {
      let payload: any = user.split(".")[1]
      let decodedPayload = JSON.parse(atob(payload))
      let result = atob(decodedPayload.psu)
      return JSON.parse(result)
    }
    return null;
  }

  public getUserDataJwt(): any {
    const user = window.sessionStorage.getItem(USER_DATA_KEY);
    if (user) return user;
    return null
  }

  public removeUserData(): void {
    window.sessionStorage.removeItem(USER_DATA_KEY);
  }

}
