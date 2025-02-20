import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './components/login.component';
import { SharedModule } from '../../shared/shared.module';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
@NgModule({
  declarations: [LoginComponent],
  imports: [CommonModule, SharedModule, RouterModule, FormsModule],
  exports: [LoginComponent],
})
export class LoginModule {}
