import { HttpClient } from '@angular/common/http';
import { Component, OnInit, TemplateRef, OnDestroy } from '@angular/core';
import { AuthDataStorageService } from '../auth-data-storage.service';
import { ConfigService } from '../config.service';
import { Config } from '../Models/config';
import { Ship } from "../Models/ship";
import { ShipResponse } from '../Models/shipResponse';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Guid } from "guid-typescript";
import { NotifcationService } from '../notifcation.service';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';

@Component({
  selector: 'app-ships',
  templateUrl: './ships.component.html',
  styleUrls: ['./ships.component.css']
})
export class ShipsComponent implements OnInit, OnDestroy {
  ship: Ship = {
    code: "",
    dimensions: [],
    shipId: Guid.create().toString(),
    shipName: "",
  };
  isNewShip: boolean = false;
  role: string = "";
  canModify: boolean = this.role == "Admin";
  isConnected: boolean = false;

  config: Config = {
    authenticationUrl: "",
    createShipsUrl: "",
    deactivateShipsUrl: "",
    getShipsUrl: "",
    getShipUrl: "",
    updateShipsUrl: "",
    notificationUrl: "",
	host: "",
  };
  pageIndex: number = 1;
  count: number = 0;
  pageSize: number = 10;

  shipResponses: ShipResponse[] = []
  modalRef: BsModalRef = new BsModalRef();

  currentShip: ShipResponse = this.getEmptyShipResponse();
  successAlert =
    {
      type: 'success',
      msg: `Operation successful`
    };

  dangerAlert = {
    type: 'danger',
    msg: `Operation failed: `
  };

  alerts: any[] = [];

  private getEmptyShipResponse(): ShipResponse {
    return {
      createdDate: new Date(),
      lastUpdatedDate: new Date(),
      ship: {
        code: "",
        dimensions: [],
        shipId: Guid.create().toString(),
        shipName: "",
      }
    };
  }

  correlationId: string = Guid.create.toString();

  constructor(private http: HttpClient,
    private modalService: BsModalService,
    private configService: ConfigService,
    private notificationService: NotifcationService,
    private authDataStorageService: AuthDataStorageService) {


  }

  clearData(): void {
    this.currentShip = this.getEmptyShipResponse();
    this.alerts = [];
    this.shipResponses = [];
    this.pageIndex = 1;
    this.count = 0;
  }

  ngOnDestroy(): void {
    this.clearData();
  }

  ngOnInit(): void {
    this.role = this.authDataStorageService.getAuthenticationInfo().role;
    this.canModify = this.role == "Admin";
    if (this.role == "User" || this.role == "Admin") {
      this.loadShipData();
    }
    this.authDataStorageService.userAuthDataChange.subscribe(x => {
      this.role = x.role;
      this.canModify = this.role == "Admin";
      if (this.role == "User" || this.role == "Admin") {
        this.loadShipData();
      }
      if (!this.role) {
        this.clearData();
      }
    });

    this.configService.getConfig().subscribe((data: Config) => {
      this.config = data;
      this.loadShipData();

      this.notificationService.connectionChange.subscribe(connected => {
        if (connected) {
          this.correlationId = Guid.create().toString();
          this.notificationService.messageChange.subscribe(message => {
            if (message) {
              var messagePayload = JSON.parse(message);

              if (messagePayload.EventMessage && messagePayload.EventMessage.EventMessageCode == 1) {
                this.alerts.push(this.successAlert);
              }
              else if (messagePayload.EventMessages && messagePayload.EventMessages[0].EventMessageCode == 2) {
                var failedAlertMessage: any = new Object;
                failedAlertMessage.type = this.dangerAlert.type;
                failedAlertMessage.msg = this.dangerAlert.msg + messagePayload.EventMessages[0].Data[2];
                this.alerts.push(failedAlertMessage);
              }
              this.loadShipData();
            }
          });
          this.notificationService.subscribeToContext(this.correlationId);
        }
      });
      this.notificationService.connect(this.config.notificationUrl);
    });
  }

  edit(index: number, template: TemplateRef<any>): void {
    this.isNewShip = false;
    this.currentShip = this.shipResponses[index];
    this.modalRef = this.modalService.show(template);
  }

  delete(index: number): void {
    var payload: any = new Object;
    payload.CorrelationId = this.correlationId;
    var url: string = this.config.deactivateShipsUrl;
    payload.ShipsToDeactivate = [{ ShipId: this.shipResponses[index].ship.shipId }];
    this.http.post(url, payload).subscribe(resp => {
      this.currentShip = this.getEmptyShipResponse();
      this.modalRef.hide();
    })
  }

  addDimension(): void {
    this.currentShip.ship.dimensions.push({
      dimensionId: Guid.create().toString(),
      height: 0.0,
      unit: '',
      width: 0.0,
    });
  }

  AddNewShip(template: TemplateRef<any>): void {
    this.currentShip = this.getEmptyShipResponse();
    this.isNewShip = true;
    this.modalRef = this.modalService.show(template);
  }

  removeDimension(index: number): void {
    this.currentShip.ship.dimensions.splice(index, 1);
  }

  modalClose(): void {
    this.loadShipData();
    this.currentShip = this.getEmptyShipResponse();
    this.modalRef.hide();
  }

  modalSubmit(): void {
    var shipPayload = [{
      ShipId: this.currentShip.ship.shipId,
      ShipName: this.currentShip.ship.shipName,
      Code: this.currentShip.ship.code,
      Dimensions: this.currentShip.ship.dimensions.map(dimension => {
        return {
          DimensionId: dimension.dimensionId,
          Height: dimension.height,
          Width: dimension.width,
          Unit: dimension.unit,
        }
      }),
    }];
    var payload: any = new Object;
    payload.CorrelationId = this.correlationId;
    var url: string = "";
    if (this.isNewShip) {
      url = this.config.createShipsUrl;
      payload.ShipsToAdd = shipPayload;

    }
    else {
      url = this.config.updateShipsUrl;
      payload.ShipsToUpdate = shipPayload;
    }

    this.http.post(url, payload).subscribe(resp => {
      this.currentShip = this.getEmptyShipResponse();
      this.modalRef.hide();
    })
  }

  onAlertClosed(index: number): void {
    this.alerts.splice(index, 1);
  }

  pageChanged(event: PageChangedEvent): void {
    this.pageIndex = event.page;
    this.loadShipData();
  }

  loadShipData(): void {
    if (!this.config.getShipsUrl) {
      return;
    }

    try {
      var getShipsUrl = this.config.getShipsUrl + "pageIndex=" + (this.pageIndex - 1) + "&pageSize=" + this.pageSize + "&CountRequirement=WithCount";
      this.shipResponses = [];

      this.http.get(getShipsUrl).subscribe((resp: any) => {
        console.log(resp);
        this.count = resp.count;
        resp.responsePayloads?.forEach((payload: any) => {
          this.shipResponses.push({
            ship: {
              code: payload.code,
              dimensions: payload.dimensions.map((dim: any) => {
                return {
                  dimensionId: dim.dimensionId,
                  height: dim.height,
                  width: dim.width,
                  unit: dim.unit,
                };

              }),
              shipId: payload.shipId,
              shipName: payload.shipName,
            },
            createdDate: payload.createdDate,
            lastUpdatedDate: payload.lastUpdatedDate,
          });
        });

      });
    } catch (e) {
      console.log(e)
    }

  }

}
