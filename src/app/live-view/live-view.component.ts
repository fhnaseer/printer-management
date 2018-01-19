import { Component, OnInit } from '@angular/core';
import { Observable } from "rxjs/Rx";
import { Router, ActivatedRoute, Params } from '@angular/router';

import { Printer, MockedPrinters } from './../models';
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
  getNextStatus: boolean = true;
  currentId: number = 0;

  constructor(private printerService: PrinterService, private router: Router, private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.printers = MockedPrinters;
    this.populateGraphData();
    this.activatedRoute.params.subscribe((params: Params) => {
      this.ip = params["id"];
      let timer = Observable.timer(0, 10000);
      timer.subscribe(t => {
        this.getPrinterInformation(this.currentId);
      });
    });
  }

  getPrinterInformation(id: number) {
    if (this.getNextStatus == false) return;
    this.getNextStatus = false;
    if (this.printerService != null) {
      this.printerService
        .getPrinterStatus(this.ip, id)
        .then(response => {
          this.printers[id] = response;
          this.currentId++;
          if (this.currentId == 5)
            this.currentId = 0;
          this.getNextStatus = true;
        })
        .catch(reason => console.log(reason));
    }
  }

  populateGraphData() {
    for (var i = 0; i < this.printers.length; i++)
      this.getPrinterHistoryData(i);
  }

  getPrinterHistoryData(id: number) {
    for (var i = 0; i < this.printers.length; i++)
      this.labels[i] = this.printers[i].name;
    this.printerService.getPrinterUsageCount(this.ip, id)
      .then(response => {
        this.labelCount[id] = response;
      })
      .catch(reason => console.log(reason));
  }

  public labels: string[] = Array(0);
  public labelCount: number[] = Array(0);
  public chartType: string = 'doughnut';
}
