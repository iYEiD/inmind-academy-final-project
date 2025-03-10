import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './core/authentication/login/login.component';
import { UserProductsComponent } from './features/products/user-products/user-products.component';
import { adminAuthGuard } from './guards/admin-auth.guard';
import { HomeComponent } from './features/home/home.component';
import { ProductDetailsComponent } from './features/products/product-details/product-details.component';
import { SignupComponent } from './core/authentication/signup/signup.component';
import { userGuard } from './guards/user.guard';
import { authGuard } from './guards/auth.guard';
const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent, canActivate: [userGuard] },
  { path: 'signup', component: SignupComponent, canActivate: [userGuard] },
  { path: 'products', component: UserProductsComponent },
  {
    path: 'shopping-cart',
    loadChildren: () =>
      import('./features/shopping-cart/shopping-cart.module').then(
        (m) => m.ShoppingCartModule
      ),
  },
  { path: 'product-details/:productName', component: ProductDetailsComponent },
  {
    path: 'account-management',
    loadChildren: () =>
      import('./features/account-management/account-management.module').then(
        (m) => m.AccountManagementModule
      ),
    canActivate: [authGuard],
  },
  {
    path: 'admin',
    loadChildren: () =>
      import('./features/dashboard/dashboard.module').then(
        (m) => m.DashboardModule
      ),
    canActivate: [adminAuthGuard],
  },
  { path: '', redirectTo: '/', pathMatch: 'full' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'enabled', // Scroll to top when route changes
      anchorScrolling: 'enabled', // Scroll to anchor when route changes
      scrollOffset: [0, 0], // Scroll offset
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
