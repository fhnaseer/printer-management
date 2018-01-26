import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from "@angular/router";
import { HttpModule } from "@angular/http";
import { ChartsModule } from 'ng2-charts';
import { FormsModule } from '@angular/forms';

import { AppRoutes } from "./routes";

import { AppComponent } from './app/app.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { LiveViewComponent } from './live-view/live-view.component';

import { PrinterService } from './services/printer.service'

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    LiveViewComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(AppRoutes),
    HttpModule,
    ChartsModule,
    FormsModule
  ],
  providers: [PrinterService],
  bootstrap: [AppComponent]
})
export class AppModule { }
