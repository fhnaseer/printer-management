import { Routes } from "@angular/router";

import { CommanderComponent } from "@app/commander/commander.component";
import { ConnectComponent } from "@app/connect/connect.component";

export const ROUTES: Routes = [
  // { path: "", component: CommanderComponent },
  { path: ":id", component: CommanderComponent },
  { path: "", component: ConnectComponent }
];
