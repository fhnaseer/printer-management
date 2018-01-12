import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "app-connect",
  templateUrl: "./connect.component.html",
  styles: []
})
export class ConnectComponent implements OnInit {
  constructor(private router: Router) { }

  ngOnInit() { }

  ip1: string;
  ip2: string;
  ip3: string;
  ip4: string;
  port: string;

  connect(): void {
    var ip = this.ip1 + "." + this.ip2 + "." + this.ip3 + "." + this.ip4 + ":" + this.port;
    console.log(ip);
    this.router.navigate([ip]);
  }
}
