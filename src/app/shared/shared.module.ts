import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputComponent } from './components/input/input.component';
import { ButtonComponent } from './components/button/button.component';

@NgModule({
  declarations: [InputComponent, ButtonComponent],
  imports: [CommonModule],
  exports: [InputComponent, ButtonComponent],
})
export class SharedModule {}
