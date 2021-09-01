import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ShipsComponent } from './ships/ships.component';
import { AuthenticationComponent } from './authentication/authentication.component';
import { NgxWebstorageModule } from 'ngx-webstorage';
import { NavigationBarComponent } from './navigation-bar/navigation-bar.component';
import { AuthInterceptorInterceptor } from './auth-interceptor.interceptor';
import { ModalModule } from 'ngx-bootstrap/modal';
import { AlertModule } from 'ngx-bootstrap/alert';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { AuthDataStorageService } from './auth-data-storage.service';

@NgModule({
  declarations: [
    AppComponent,
    ShipsComponent,
    AuthenticationComponent,
    NavigationBarComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    NgxWebstorageModule.forRoot(),
    ModalModule.forRoot(),
    AlertModule.forRoot(),
    PaginationModule.forRoot(),
  ],
  providers: [AuthDataStorageService, { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorInterceptor, multi: true },],
  bootstrap: [AppComponent]
})
export class AppModule { }
