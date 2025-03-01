import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsModule } from './products/products.module';
import { AgGridModule } from 'ag-grid-angular';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { HomeComponent } from './home/home.component';
import { SharedModule } from '../shared/shared.module';
import { ShoppingCartModule } from './shopping-cart/shopping-cart.module';
ModuleRegistry.registerModules([AllCommunityModule]);

@NgModule({
  declarations: [HomeComponent],
  imports: [
    CommonModule,
    ProductsModule,
    AgGridModule,
    SharedModule,
    ShoppingCartModule,
  ],
  exports: [ProductsModule, HomeComponent],
})
export class FeaturesModule {}
