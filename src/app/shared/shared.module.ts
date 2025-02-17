import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputComponent } from './components/input/input.component';
import { ButtonComponent } from './components/button/button.component';
import { ProductCardComponent } from './components/product-card/product-card.component';

@NgModule({
  declarations: [InputComponent, ButtonComponent, ProductCardComponent],
  imports: [CommonModule],
  exports: [InputComponent, ButtonComponent, ProductCardComponent],
})
export class SharedModule {}
