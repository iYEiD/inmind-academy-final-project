import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'app-profile-renderer',
  templateUrl: './profile-renderer.component.html',
  styleUrls: ['./profile-renderer.component.scss'],
})
export class ProfileRendererComponent implements ICellRendererAngularComp {
  params: any;
  formattedCategory!: string;

  agInit(params: any): void {
    this.params = params;
    this.formattedCategory = this.formatCategory(params.data.category);
  }

  refresh(params: any): boolean {
    return false;
  }

  private formatCategory(category: string): string {
    return category.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  }
}
