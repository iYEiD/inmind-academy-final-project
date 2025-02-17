import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginModule } from './login/login.module';
import { ProductsModule } from './products/products.module';
@NgModule({
  declarations: [],
  imports: [CommonModule, LoginModule, ProductsModule],
  exports: [LoginModule, ProductsModule],
})
export class FeaturesModule {}
