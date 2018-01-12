import { Injectable } from "@angular/core";
import { Http } from "@angular/http";

import "rxjs/add/operator/toPromise";

import { environment } from "@env/environment";
import { BaseService } from "./base.service";
import { ResponseContentType } from "@angular/http/src/enums";
import { Metadata } from "@app/models";

@Injectable()
export class ImageService extends BaseService {
  constructor(private http: Http) {
    super(http);
  }

  getImage(ip: string): Promise<Blob> {
    return this.http
      .get(this.getImageUrl(ip), { responseType: 1 })
      .toPromise()
      .then(res => {
        console.log(res);
        return res.blob();
      });
  }

  getMetadata(ip: string): Promise<Metadata> {
    return this.http
      .get(this.getMetadataUrl(ip), { responseType: 1 })
      .toPromise()
      .then(res => {
        return res.json() as Metadata;
      });
  }

  private getIp(ip: string): string {
    if (ip == null) return this.httpUrl;
    return "http://" + ip + "/";
  }

  private getImageUrl(ip: string): string {
    return "http://141.40.254.131:9200/myclient2/sensor/29";
    // return this.getIp(ip) + "output.jpg";
  }

  private getMetadataUrl(ip: string): string {
    return this.getIp(ip) + "output.json";
  }
}
