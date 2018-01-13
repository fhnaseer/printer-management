import { Injectable } from '@angular/core';
import { Http } from "@angular/http";

import { BaseService } from './base.service';
import { Printer, MockedPrinters } from '../models';

@Injectable()
export class PrinterService extends BaseService {

  constructor(private http: Http) {
    super(http);
  }

  private getIp(ip: string): string {
    if (ip == null) return this.httpUrl;
    return "http://" + ip + "/";
  }

  getMetadata(ip: string): Promise<Printer[]> {
    // return MockedPrinters;

    return this.http
      .get(this.getIp(ip), { responseType: 1 })
      .toPromise()
      .then(res => {
        return res.json() as Printer[];
      })
      .catch(error => {
        return MockedPrinters;
      })
  }
}
