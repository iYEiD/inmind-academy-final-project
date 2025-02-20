import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './components/navbar/navbar.component';
import { RouterModule } from '@angular/router';
import { FooterComponent } from './components/footer/footer.component';
import { SharedModule } from '../shared/shared.module';
import { FormsModule } from '@angular/forms';
import { LoginComponent } from './authentication/login/components/login.component';

@NgModule({
  declarations: [NavbarComponent, FooterComponent, LoginComponent],
  imports: [CommonModule, RouterModule, FormsModule, SharedModule],
  exports: [NavbarComponent, FooterComponent, LoginComponent],
})
export class CoreModule {}
