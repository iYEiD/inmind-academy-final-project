import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserProductsComponent } from './user-products/user-products.component';
import { SharedModule } from '../../shared/shared.module';
import { StatusRendererComponent } from './admin-products/components/status-renderer/status-renderer.component';
import { ProfileRendererComponent } from './admin-products/components/profile-renderer/profile-renderer.component';
import { AdminProductsComponent } from './admin-products/admin-products.component';
import { AgGridModule } from 'ag-grid-angular';
@NgModule({
  declarations: [
    UserProductsComponent,
    StatusRendererComponent,
    ProfileRendererComponent,
    AdminProductsComponent,
  ],
  imports: [CommonModule, SharedModule, AgGridModule],
  exports: [
    UserProductsComponent,
    StatusRendererComponent,
    ProfileRendererComponent,
    AdminProductsComponent,
  ],
})
export class ProductsModule {}
