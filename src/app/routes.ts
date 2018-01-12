import { Routes } from "@angular/router";

import { LiveViewComponent } from "./live-view/live-view.component";

export const AppRoutes: Routes = [
    { path: ":id", component: LiveViewComponent },
    { path: "", component: LiveViewComponent }
];
