import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './core/authentication/login/components/login.component';
import { UserProductsComponent } from './features/products/user-products/user-products.component';
import { AdminProductsComponent } from './features/products/admin-products/admin-products.component';
import { adminAuthGuard } from './guards/admin-auth.guard';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'products', component: UserProductsComponent },
  {
    path: 'admin/products',
    component: AdminProductsComponent,
    canActivate: [adminAuthGuard],
  },
  { path: '', redirectTo: '/products', pathMatch: 'full' }, // Default route
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
