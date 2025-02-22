import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsComponent } from './components/products.component';
import { SharedModule } from '../../shared/shared.module';
import { StatusRendererComponent } from '../admin-products/components/status-renderer/status-renderer.component';
import { ProfileRendererComponent } from '../admin-products/components/profile-renderer/profile-renderer.component';
@NgModule({
  declarations: [
    ProductsComponent,
    StatusRendererComponent,
    ProfileRendererComponent,
  ],
  imports: [CommonModule, SharedModule],
  exports: [
    ProductsComponent,
    StatusRendererComponent,
    ProfileRendererComponent,
  ],
})
export class ProductsModule {}
