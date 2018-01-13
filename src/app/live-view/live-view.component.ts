import { Component, OnInit } from '@angular/core';
import { Observable } from "rxjs/Rx";
import { Router, ActivatedRoute, Params } from '@angular/router';

import { Printer } from './../models';
import { PrinterService } from '../services/printer.service';

@Component({
  selector: 'app-root',
  templateUrl: './live-view.component.html',
  styleUrls: ['./live-view.component.css']
})
export class LiveViewComponent implements OnInit {

  printers: Printer[];
  selectedPrinter: Printer;

  ip: string;

  constructor(private printerService: PrinterService, private router: Router, private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.getPrinterInformation(null);
    // this.activatedRoute.params.subscribe((params: Params) => {
    //   this.ip = params["id"];
    //   let timer = Observable.timer(0, 100);
    //   timer.subscribe(t => {
    //     this.getPrinterInformation(t);
    //   });
    // });
  }

  getPrinterInformation(tick) {
    console.log('getting data');
    if (this.printerService != null) {
      this.printerService
        .getMetadata(this.ip)
        .then(response => {
          this.printers = response;
        })
        .catch(reason => console.log(reason));
    }
  }
}
