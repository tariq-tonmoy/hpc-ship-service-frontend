import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Config } from './Models/config';
import { environment } from './../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private configUrl: string = "";
  constructor(private http: HttpClient) {
    this.configUrl = "assets/" + environment.appConfigFileName;
  }

  getConfig() {
    return this.http.get<Config>(this.configUrl);
  }
}
