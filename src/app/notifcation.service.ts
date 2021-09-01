import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotifcationService {
  private hubConnection: HubConnection | undefined;
  messageChange: Subject<any> = new Subject<any>();
  connectionChange: Subject<boolean> = new Subject<boolean>();
  constructor() { }

  connect(hubUrl: string): void {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(hubUrl)
      .build();
    this.hubConnection.on('ReceiveEvent', (message) => {
      this.messageChange.next(message);
    });

    this.hubConnection.start()
      .then(() => {
        this.connectionChange.next(true);
      })
      .catch((err) => console.log('error while establishing signalr connection: ' + err));
  }

  subscribeToContext(context: string): void {
    this.hubConnection?.invoke("Register", context).then(() => {
    });

  }
}
