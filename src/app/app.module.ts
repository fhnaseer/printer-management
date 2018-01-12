import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from "@angular/router";

import { AppRoutes } from "./routes";

import { LiveViewComponent } from './live-view/live-view.component';

@NgModule({
  declarations: [
    LiveViewComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(AppRoutes)
  ],
  providers: [],
  bootstrap: [LiveViewComponent]
})
export class AppModule { }
