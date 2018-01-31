import { Injectable } from '@angular/core';
import { Http } from "@angular/http";

import { BaseService } from './base.service';
import { Printer, MockedPrinters, SensorData } from '../models';
import { environment } from './../../environments/environment';

@Injectable()
export class PrinterService extends BaseService {

  constructor(private http: Http) {
    super(http);
  }

  private getIp(ip: string): string {
    if (ip == null) return this.httpUrl;
    return "http://" + ip + "/";
  }

  private getPrinterId(printer: number): string {
    if (printer == 0)
      return environment.printerOne;
    if (printer == 1)
      return environment.printerTwo;
    else
      return environment.printerThree;
  }

  private getSensorIp(ip: string, printer: number): string {
    return this.getIp(ip) + "get_sensor_data/" + this.getPrinterId(printer) + "/" + environment.sensorId;
  }

  private getRecentSensorDataIp(ip: string, printer: number): string {
    var newDate = Math.round((new Date(new Date().getTime() - 5 * 60000)).getTime() / 1000);
    return this.getSensorIp(ip, printer) + '/' + newDate;
  }

  private getPrinterMetadata(printer: number, data: SensorData[]): Printer {
    var result = new Printer();
    result.id = printer;
    result.name = MockedPrinters[printer].name;
    result.reserved = true;
    result.available = 'No';
    console.log(printer);
    console.log(data);
    var today = new Date();
    for (var i = 0; i < data.length; i++) {
      var time = new Date(data[i].timestamp * 1000);
      var dif = today.getTime() - time.getTime();
      if (dif / 1000 / 60 < 1) {
        if (data[i].values[0].value > 35) {
          result.available = 'Yes';
          result.reserved = false;
          break;
        }
      }
    }
    return result;
  }

  getPrinterStatus(ip: string, printer: number): Promise<Printer> {
    return this.http
      .get(this.getRecentSensorDataIp(ip, printer))
      .toPromise()
      .then(res => {
        return this.getPrinterMetadata(printer, res.json());
      })
      .catch(error => {
        console.log('here');
        return MockedPrinters[printer];
      })
  }

  getPrinterUsageCount(ip: string, printer: number): Promise<number> {
    return this.http
      .get(this.getSensorIp(ip, printer))
      .toPromise()
      .then(res => {
        return res.json().length / 60;
      })
      .catch(error => {
        return 0;
      })
  }
}
