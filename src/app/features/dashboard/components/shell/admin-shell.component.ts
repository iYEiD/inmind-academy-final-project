import { Component, ViewChild, HostListener } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
  selector: 'app-admin-shell',
  templateUrl: './admin-shell.component.html',
  styleUrl: './admin-shell.component.scss',
})
export class AdminShellComponent {
  // To refactor later, we can use common with account-management component
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
