import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserProductsComponent } from './user-products/user-products.component';
import { SharedModule } from '../../shared/shared.module';
import { StatusRendererComponent } from './admin-products/components/status-renderer/status-renderer.component';
import { ProfileRendererComponent } from './admin-products/components/profile-renderer/profile-renderer.component';
import { AdminProductsComponent } from './admin-products/admin-products.component';
import { AgGridModule } from 'ag-grid-angular';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { FormsModule } from '@angular/forms';
@NgModule({
  declarations: [
    UserProductsComponent,
    StatusRendererComponent,
    ProfileRendererComponent,
    AdminProductsComponent,
    ProductDetailsComponent,
  ],
  imports: [CommonModule, SharedModule, AgGridModule, FormsModule],
  exports: [
    UserProductsComponent,
    StatusRendererComponent,
    ProfileRendererComponent,
    AdminProductsComponent,
    ProductDetailsComponent,
  ],
})
export class ProductsModule {}
