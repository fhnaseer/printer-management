import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { HttpModule } from "@angular/http";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ResponseContentType } from "@angular/http/src/enums";
import { WindowRef } from "./WindowRef";
import { ROUTES } from "@app/routes";

import { AgmCoreModule } from '@agm/core';

import { ImageService } from "@app/_services/image.service";

import { AppComponent } from "@app/app.component";

import { CommanderComponent } from "./commander/commander.component";
import { ConnectComponent } from './connect/connect.component';

@NgModule({
  declarations: [AppComponent, CommanderComponent, ConnectComponent],
  imports: [
    BrowserModule,
    RouterModule.forRoot(ROUTES),
    FormsModule,
    HttpModule,
    BrowserAnimationsModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyAwGnMKWARCsqOew4qK-VeFr_Y05uYIGOE'
    })
  ],
  providers: [ImageService, WindowRef],
  bootstrap: [AppComponent]
})
export class AppModule { }
