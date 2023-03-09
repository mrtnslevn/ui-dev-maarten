import { HTTP_INTERCEPTORS, HttpEvent, HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { TokenStorageService } from './token-storage.service';
import { Md5 } from 'ts-md5/dist/md5';
import { createHash } from 'sha256-uint8array';
import { formatDate } from '@angular/common';
import { catchError, switchMap, timeout } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { RESPONSE_TOKEN_EXPIRED } from '../_configs/app-config';

const TOKEN_HEADER_KEY = 'Authorization';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private token: TokenStorageService, private authService: AuthService, private http: HttpClient) { }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    
    let authReq = req;
    const token = this.token.getToken();
    const userData = this.token.getUserDataJwt();
    if (token != null) {
      const tgl = formatDate(Date.now(), "yyyy-MM-ddTHH:mm:ss", "en-US");
      const text = Md5.hashStr("angularui:" + tgl);
      const signature = createHash().update(text).digest("hex");

      if(userData != null) {
        authReq = req.clone({headers: req.headers.set(TOKEN_HEADER_KEY, 'Bearer ' + token)
          .set("request_time", tgl)
          .set("psu_token", userData)
          .set("channel_id", "angularui")
          .set("source_ref_id", Date.now().toString())
          .set("signature-key", signature)});
      } else {
        authReq = req.clone({ headers: req.headers.set(TOKEN_HEADER_KEY, 'Bearer ' + token)
        .set("request_time", tgl)
        .set("channel_id", "angularui")
        .set("source_ref_id", Date.now().toString())
        .set("signature-key", signature)});
      }
    } else {
      
    }
    return next.handle(authReq).pipe(
      timeout(600000),
      catchError(err => {
      if (err instanceof HttpErrorResponse && err.status == 401 && 
      err.error.response_code == RESPONSE_TOKEN_EXPIRED) {
        return this.handleTokenExpired(authReq, next);
      }
      return throwError(err);
    }))
  }

  private handleTokenExpired(request: HttpRequest<any>, next: HttpHandler) {
    const refreshToken = this.token.getUser().refresh_token;
    
    return this.authService.refreshToken(refreshToken).pipe(
      switchMap((response) => {
        return next.handle(this.addTokenHeader(request, response));
      })
    )
  }

  private addTokenHeader(request: HttpRequest<any>, response: any) {
    this.token.saveUser(response);
    this.token.saveToken(response.access_token)
    return request.clone({ headers: request.headers.set(TOKEN_HEADER_KEY, 'Bearer ' + response.access_token) })
  }
}
export const authInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
];
