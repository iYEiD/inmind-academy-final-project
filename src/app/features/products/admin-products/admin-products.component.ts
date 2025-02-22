import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../services/products.service';
import { CellApiModule, ColDef } from 'ag-grid-community';
import { AdminDashboardDTO, ICategory } from '../../../models/product.model';
import { StatusRendererComponent } from './components/status-renderer/status-renderer.component';
import { ProfileRendererComponent } from './components/profile-renderer/profile-renderer.component';

@Component({
  selector: 'app-admin-products',
  templateUrl: './admin-products.component.html',
  styleUrl: './admin-products.component.scss',
})
export class AdminProductsComponent implements OnInit {
  rowData: AdminDashboardDTO[] = [];
  loading = true;
  error = false;
  columnDefs: ColDef[] = [
    {
      headerName: 'Product',
      field: 'title',
      filter: false,
      cellRenderer: ProfileRendererComponent,
      comparator: (valueA, valueB, nodeA, nodeB) =>
        nodeA.data.title.localeCompare(nodeB.data.title),
    },
    {
      headerName: 'Inventory',
      field: 'inventory',
      filter: false,
      sortable: true,
      cellRenderer: StatusRendererComponent,
      comparator: (valueA, valueB, nodeA, nodeB) => valueA - valueB,
    },
    {
      headerName: 'Price',
      field: 'price',
      sortable: true,
      valueFormatter: (params) => `$${params.value.toFixed(2)}`,
      filter: 'agNumberColumnFilter',
    },
    {
      headerName: 'Rating',
      field: 'rating',
      sortable: true,
      filter: 'agNumberColumnFilter',
    },
  ];

  defaultColDef = {
    flex: 1,
    minWidth: 150,
    filter: true,
    resizable: true,
    cellStyle: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-start',
      width: '100%',
    },
  };

  constructor(private productService: ProductsService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getAdminProducts(50, 0).subscribe((response) => {
      this.rowData = response.products;
      console.log(this.rowData);
      this.loading = false;
    });
  }

  // onGridReady(params: GridReadyEvent<AdminDashboardDTO>) {
  //   params.api.sizeColumnsToFit();
  //   params.api.resetRowHeights();
  // }

  // Add this later
  handleCheckReviews(productId: number) {
    console.log('Check reviews for product:', productId);
  }

  formatCategory(category: ICategory): string {
    return category
      .toString()
      .replace(/-/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase());
  }
}
