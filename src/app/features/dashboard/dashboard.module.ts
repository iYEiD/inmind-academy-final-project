import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminShellComponent } from './components/shell/admin-shell.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { DashboardRoutingModule } from './dashboard-routing';

@NgModule({
  declarations: [AdminShellComponent, DashboardComponent],
  imports: [
    CommonModule,
    MatSidenavModule,
    MatButtonModule,
    RouterModule,
    DashboardRoutingModule,
  ],
  exports: [AdminShellComponent, DashboardComponent],
})
export class DashboardModule {}
