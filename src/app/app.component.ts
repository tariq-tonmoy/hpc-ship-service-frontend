import { Component, OnInit } from '@angular/core';
import { AuthDataStorageService } from './auth-data-storage.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  isAuthenticated: boolean = false;

  constructor(private authDataStorageService: AuthDataStorageService) {

  }

  ngOnInit(): void {
    this.authDataStorageService.userAuthDataChange.subscribe(x => {
      this.isAuthenticated = x.isAuthenticated;
    });

    this.isAuthenticated = this.authDataStorageService.getAuthenticationInfo().isAuthenticated;
  }
}
