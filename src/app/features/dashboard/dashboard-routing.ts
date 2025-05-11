import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminShellComponent } from './components/shell/admin-shell.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AdminProductsComponent } from '../products/admin-products/admin-products.component';
import { adminAuthGuard } from '../../guards/admin-auth.guard';

const routes: Routes = [
  {
    path: '',
    component: AdminShellComponent,
    children: [
      {
        path: 'admin/dashboard',
        component: DashboardComponent,
        canActivate: [adminAuthGuard],
      },
      {
        path: 'admin/products',
        component: AdminProductsComponent,
        canActivate: [adminAuthGuard],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
