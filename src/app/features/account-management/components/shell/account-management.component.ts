import { Component, ViewChild, HostListener } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
  selector: 'app-account-management',
  templateUrl: './account-management.component.html',
  styleUrl: './account-management.component.scss',
})
export class AccountManagementComponent {
  @ViewChild('sidenav') sidenav!: MatSidenav;
  isMobile = false;

  @HostListener('window:resize')
  onResize() {
    this.checkScreenSize();
  }

  ngOnInit(): void {
    this.checkScreenSize();
  }

  private checkScreenSize(): void {
    this.isMobile = window.innerWidth < 992;
  }

  toggleSidenav(): void {
    this.sidenav.toggle();
  }

  closeSidenav(): void {
    if (this.isMobile) {
      this.sidenav.close();
    }
  }
}
