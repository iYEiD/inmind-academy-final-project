import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './core/authentication/login/components/login.component';
import { UserProductsComponent } from './features/products/user-products/user-products.component';
import { AdminProductsComponent } from './features/products/admin-products/admin-products.component';
import { adminAuthGuard } from './guards/admin-auth.guard';
import { HomeComponent } from './features/home/home.component';
import { ProductDetailsComponent } from './features/products/product-details/product-details.component';
const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'products', component: UserProductsComponent },
  { path: 'product-details/:productName', component: ProductDetailsComponent },
  {
    path: 'admin/products',
    loadChildren: () =>
      import('./features/products/products.module').then(
        (m) => m.ProductsModule
      ),
    canActivate: [adminAuthGuard],
  },
  { path: '', redirectTo: '/products', pathMatch: 'full' }, // Default route
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
