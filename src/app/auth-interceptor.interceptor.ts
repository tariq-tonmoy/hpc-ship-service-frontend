import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthDataStorageService } from './auth-data-storage.service';
import { UserCredentials } from './Models/userCredentials';
import { UserAuthData } from './Models/userAuthData';
import { LocalStorageService } from 'ngx-webstorage';

@Injectable()
export class AuthInterceptorInterceptor implements HttpInterceptor {

  private userCredentials: UserCredentials | undefined;

  private userAuthData: UserAuthData | undefined;

  constructor(private authDataStorageService: AuthDataStorageService, private storage: LocalStorageService) {
    this.userAuthData = this.authDataStorageService.getAuthenticationInfo();
    this.userCredentials = this.authDataStorageService.getCredentials();
    this.authDataStorageService.userCredentialsChange.subscribe(x => {
      this.userCredentials = x;
    });
    this.authDataStorageService.userAuthDataChange.subscribe(x => this.userAuthData = x);
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.userAuthData && this.userCredentials && this.userAuthData?.isAuthenticated) {
      let credentials = window.btoa(this.userCredentials.username + ':' + this.userCredentials.password)
      request = request.clone({
        setHeaders: {
          Authorization: `Basic ${credentials}`,
          'Access-Control-Allow-Origin': '127.0.0.40',
          'Content-Type': 'application/json'
        }
      });
    }

    return next.handle(request);
  }
}
