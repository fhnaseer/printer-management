import { Component, OnInit } from '@angular/core';
import { Observable } from "rxjs/Rx";
import { Router, ActivatedRoute, Params } from '@angular/router';

import { Printer, MockedPrinters, MockedPrinters2, MockedPrinters3, MockedPrinters4 } from './../models';
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

  demoMode: boolean = false;

  constructor(private printerService: PrinterService, private router: Router, private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.printers = MockedPrinters;
    this.sortPrinters();
    this.populateGraphData();
    if (!this.demoMode) {
      this.activatedRoute.params.subscribe((params: Params) => {
        this.ip = params["id"];
        let timer = Observable.timer(0, 10000);
        timer.subscribe(t => {
          this.getPrinterInformation(this.currentId);
        });
      });
    }
  }

  mockedData: number = 2;
  populateMockedData() {
    if (this.mockedData == 1)
      this.printers = MockedPrinters;
    if (this.mockedData == 2)
      this.printers = MockedPrinters2;
    if (this.mockedData == 3)
      this.printers = MockedPrinters3;
    if (this.mockedData == 4)
      this.printers = MockedPrinters4;
    this.mockedData++;
    if (this.mockedData == 5)
      this.mockedData = 1;
    this.sortPrinters();
  }

  setReserveStatus(id: number) {
    this.sortPrinters();
  }

  sortPrinters() {
    this.printers = this.printers.sort((a, b) => (a.reserved === b.reserved) ? 0 : a.reserved ? -1 : 1);
    this.printers = this.printers.sort((a, b) => a.available.localeCompare(b.available)).reverse();
  }

  getPrinterInformation(id: number) {
    if (this.getNextStatus == false) return;
    this.getNextStatus = false;
    if (this.printerService != null) {
      this.printerService
        .getPrinterStatus(this.ip, id)
        .then(response => {
          console.log(response);
          console.log(this.printers[id]);
          this.printers[id] = response;
          this.sortPrinters();
          this.currentId++;
          if (this.currentId == 2)
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
    for (var i = 0; i < 2; i++)
      this.labels[i] = this.printers[i].name;
    if (!this.demoMode) {
      this.printerService.getPrinterUsageCount(this.ip, id)
        .then(response => {
          this.labelCount[id] = response;
        })
        .catch(reason => console.log(reason));
    }
  }

  reserve(id: number): void {
    console.log(id);
    this.printers[id].reserved = !this.printers[id].reserved;
    this.sortPrinters();

    if (this.demoMode) {
      let timer = Observable.timer(10000, 10000);
      timer.subscribe(t => {
        this.populateMockedData();
      });
    }
  }

  public labels: string[] = Array(0);
  public labelCount: number[] = [61, 32, 46, 23, 8];
  public chartType: string = 'doughnut';
}
