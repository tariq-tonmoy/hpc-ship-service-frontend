import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { UserAuthData } from './Models/userAuthData';
import { UserCredentials } from './Models/userCredentials';
import { LocalStorageService, NgxWebstorageModule } from 'ngx-webstorage';

@Injectable({
  providedIn: 'root'
})
export class AuthDataStorageService {

  userAuthDataChange: Subject<UserAuthData> = new Subject<UserAuthData>();
  userCredentialsChange: Subject<UserCredentials> = new Subject<UserCredentials>();
  constructor(private storage: LocalStorageService) {
    try {
      var authData = this.storage.retrieve('userAuthDataChange');
      this.userAuthDataChange.next(authData);

      var userCredentials = this.storage.retrieve('userCredentialsChange');
      this.userCredentialsChange.next(userCredentials);
    } catch (e) {

    }
  }

  setAuthData(authData: UserAuthData): void {
    this.storage.store('userAuthDataChange', authData);
    this.userAuthDataChange.next(authData);
  }

  setUserCredentials(userCredentials: UserCredentials): void {
    this.storage.store('userCredentialsChange', userCredentials);
    this.userCredentialsChange.next(userCredentials);
  }

  getAuthenticationInfo(): UserAuthData {
    try {
      var authData = this.storage.retrieve('userAuthDataChange');
      return authData;
    } catch (e) {
      return {
        isAuthenticated: false,
        role: "",
        userId: "",
        username: "",
      };
    }
  }

  getCredentials(): UserCredentials {
    try {
      var credentials = this.storage.retrieve('userCredentialsChange');
      return credentials;
    } catch (e) {
      return {
        password: "",
        username: "",
      };
    }
  }
}
