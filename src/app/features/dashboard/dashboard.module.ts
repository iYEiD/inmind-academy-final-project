import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminShellComponent } from './components/shell/admin-shell.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { DashboardRoutingModule } from './dashboard-routing';
import { AgGridModule } from 'ag-grid-angular';
import { AgChartsModule } from 'ag-charts-angular';

@NgModule({
  declarations: [AdminShellComponent, DashboardComponent],
  imports: [
    CommonModule,
    MatSidenavModule,
    MatButtonModule,
    RouterModule,
    DashboardRoutingModule,
    AgGridModule,
    AgChartsModule,
  ],
  exports: [AdminShellComponent, DashboardComponent],
})
export class DashboardModule {}
