import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsModule } from './products/products.module';
import { AgGridModule } from 'ag-grid-angular';
import { AdminProductsComponent } from './admin-products/admin-products.component';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
ModuleRegistry.registerModules([AllCommunityModule]);

@NgModule({
  declarations: [AdminProductsComponent],
  imports: [CommonModule, ProductsModule, AgGridModule],
  exports: [ProductsModule, AdminProductsComponent],
})
export class FeaturesModule {}
