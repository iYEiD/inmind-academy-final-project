import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsModule } from './products/products.module';
import { AgGridModule } from 'ag-grid-angular';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
ModuleRegistry.registerModules([AllCommunityModule]);

@NgModule({
  declarations: [],
  imports: [CommonModule, ProductsModule, AgGridModule],
  exports: [ProductsModule],
})
export class FeaturesModule {}
