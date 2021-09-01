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
import { ConfigService } from './config.service';
import { Config } from './Models/config';


@Injectable()
export class AuthInterceptorInterceptor implements HttpInterceptor {

  private host: string = "";
  private userCredentials: UserCredentials | undefined;

  private userAuthData: UserAuthData | undefined;

  constructor(private configService: ConfigService, private authDataStorageService: AuthDataStorageService) {
    this.userAuthData = this.authDataStorageService.getAuthenticationInfo();
    this.userCredentials = this.authDataStorageService.getCredentials();
    this.authDataStorageService.userCredentialsChange.subscribe(x => {
      this.userCredentials = x;
    });
    this.authDataStorageService.userAuthDataChange.subscribe(x => this.userAuthData = x);
    this.configService.getConfig().subscribe((data: Config) => {
      this.host = data.host;
    });
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.userAuthData && this.userCredentials && this.userAuthData?.isAuthenticated) {
      let credentials = window.btoa(this.userCredentials.username + ':' + this.userCredentials.password)
      request = request.clone({
        setHeaders: {
          Authorization: `Basic ${credentials}`,
          'Access-Control-Allow-Origin': this.host,
          'Content-Type': 'application/json'
        }
      });
    }

    return next.handle(request);
  }
}
