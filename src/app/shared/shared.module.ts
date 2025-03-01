import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductCardComponent } from './components/product-card/product-card.component';
import { StarRatingComponent } from './components/star-rating/star-rating.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CapitalizeFirstPipe } from './pipes/capitalize-first.pipe';
@NgModule({
  declarations: [
    ProductCardComponent,
    StarRatingComponent,
    CapitalizeFirstPipe,
  ],
  imports: [CommonModule, FontAwesomeModule],
  exports: [ProductCardComponent, StarRatingComponent, CapitalizeFirstPipe],
})
export class SharedModule {}
