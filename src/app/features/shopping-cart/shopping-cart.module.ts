import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { ShoppingCartComponent } from './components/shopping-cart.component';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSnackBarModule } from '@angular/material/snack-bar';

const routes: Routes = [{ path: '', component: ShoppingCartComponent }];

@NgModule({
  declarations: [ShoppingCartComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule.forChild(routes),
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatRadioModule,
    MatTableModule,
    MatIconModule,
    MatSortModule,
    MatPaginatorModule,
    MatSnackBarModule,
  ],
})
export class ShoppingCartModule {}
