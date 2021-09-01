import { Component, OnInit } from '@angular/core';
import { AuthDataStorageService } from '../auth-data-storage.service';

@Component({
  selector: 'app-navigation-bar',
  templateUrl: './navigation-bar.component.html',
  styleUrls: ['./navigation-bar.component.css']
})
export class NavigationBarComponent implements OnInit {
  isAuthenticated: boolean = false;
  username: string = "";

  constructor(private authDataStorageService: AuthDataStorageService) {

  }

  ngOnInit(): void {
    this.authDataStorageService.userAuthDataChange.subscribe(x => {
      this.isAuthenticated = x.isAuthenticated;
      this.username = x.username;
    });

    var authData = this.authDataStorageService.getAuthenticationInfo();
    this.isAuthenticated = authData.isAuthenticated;
    this.username = authData.username;
  }

  logout(): void {
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

}
