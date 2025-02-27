import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputComponent } from './components/input/input.component';
import { ButtonComponent } from './components/button/button.component';
import { ProductCardComponent } from './components/product-card/product-card.component';
import { StarRatingComponent } from './components/star-rating/star-rating.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CapitalizeFirstPipe } from './pipes/capitalize-first.pipe';
@NgModule({
  declarations: [
    InputComponent,
    ButtonComponent,
    ProductCardComponent,
    StarRatingComponent,
    CapitalizeFirstPipe,
  ],
  imports: [CommonModule, FontAwesomeModule],
  exports: [
    InputComponent,
    ButtonComponent,
    ProductCardComponent,
    StarRatingComponent,
    CapitalizeFirstPipe,
  ],
})
export class SharedModule {}
