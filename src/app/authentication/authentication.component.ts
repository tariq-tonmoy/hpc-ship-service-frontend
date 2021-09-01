import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { ConfigService } from '../config.service';
import { Config } from '../Models/config';
import { UserAuthData } from '../Models/userAuthData';
import { AuthDataStorageService } from '../auth-data-storage.service';
import { UserCredentials } from '../Models/userCredentials';

@Component({
  selector: 'app-authentication',
  templateUrl: './authentication.component.html',
  styleUrls: ['./authentication.component.css'],
})
export class AuthenticationComponent implements OnInit {
  user: UserCredentials = {
    username: "",
    password: "",
  }

  authUrl: string = "";

  submitted: boolean = false;

  constructor(
    private http: HttpClient,
    private configService: ConfigService,
    private authDataStorageService: AuthDataStorageService) {
    this.configService.getConfig().subscribe((data: Config) => {
      this.authUrl = data.authenticationUrl;
    });
  }

  ngOnInit(): void {

  }

  onSubmit(): void {
    this.http.post(this.authUrl, this.user).subscribe((resp: any) => {
      if (resp.isAuthenticated) {
        this.authDataStorageService.setAuthData(resp);
        this.authDataStorageService.setUserCredentials(this.user);
      }
      else {

        this.authDataStorageService.setAuthData({
          isAuthenticated: false,
          role: "",
          userId: "",
          username: "",
        });
        this.authDataStorageService.setUserCredentials({
          username: "",
          password: "",
        });
      }
    });
  }
}
