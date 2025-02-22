import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'app-status-renderer',
  templateUrl: './status-renderer.component.html',
  styleUrls: ['./status-renderer.component.scss'],
})
export class StatusRendererComponent implements ICellRendererAngularComp {
  params: any;
  inventory!: number;

  agInit(params: any): void {
    this.params = params;
    this.inventory = params.value || params.data.inventory;
  }

  refresh(params: any): boolean {
    return false;
  }

  get status(): string {
    if (this.inventory > 3) return `(${this.inventory}) In Stock`;
    if (this.inventory > 0) return `(${this.inventory}) Low Stock`;
    return `Out of Stock`;
  }

  get chipClass(): string {
    if (this.inventory > 3) return 'in-stock-chip';
    if (this.inventory > 0) return 'low-stock-chip';
    return 'out-of-stock-chip';
  }
}
