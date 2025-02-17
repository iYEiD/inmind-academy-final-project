import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsComponent } from './components/products.component';
import { SharedModule } from '../../shared/shared.module';
@NgModule({
  declarations: [ProductsComponent],
  imports: [CommonModule, SharedModule],
  exports: [ProductsComponent],
})
export class ProductsModule {}
