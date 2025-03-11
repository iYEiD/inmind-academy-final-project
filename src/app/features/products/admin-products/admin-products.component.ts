import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { ProductsService } from '../services/products.service';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { AdminDashboardDTO, ICategory } from '../../../models/product.model';
import { StatusRendererComponent } from './components/status-renderer/status-renderer.component';
import { ProfileRendererComponent } from './components/profile-renderer/profile-renderer.component';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-admin-products',
  templateUrl: './admin-products.component.html',
  styleUrl: './admin-products.component.scss',
})
export class AdminProductsComponent implements OnInit, OnDestroy {
  rowData: AdminDashboardDTO[] = [];
  loading = true;
  error = false;
  selectedRows: AdminDashboardDTO[] = [];
  private gridApi!: GridApi<AdminDashboardDTO>;

  columnDefs: ColDef[] = [
    {
      headerName: 'Product',
      field: 'title',
      filter: false,
      checkboxSelection: true,
      headerCheckboxSelection: true,
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
      overflow: 'hidden',
    },
  };

  private destroy$ = new Subject<void>();
  productService = inject(ProductsService);

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService
      .getAdminProducts(50, 0)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.rowData = response.products;
          console.log(this.rowData);
          this.loading = false;
        },
        error: (err) => {
          console.error('Error loading products', err);
          this.error = true;
          this.loading = false;
        },
      });
  }

  onGridReady(params: GridReadyEvent<AdminDashboardDTO>) {
    this.gridApi = params.api;
    params.api.sizeColumnsToFit();
  }

  onFilterTextBoxChanged(event: Event) {
    const input = event.target as HTMLInputElement;
    this.gridApi.setGridOption('quickFilterText', input.value);
  }

  quickFilterParser = (quickFilter: string) => {
    const quickFilterParts = [];
    let lastSpaceIndex = -1;
    const isQuote = (index: number) => quickFilter[index] === '"';
    const getQuickFilterPart = (
      lastSpaceIndex: number,
      currentIndex: number
    ) => {
      const startsWithQuote = isQuote(lastSpaceIndex + 1);
      const endsWithQuote = isQuote(currentIndex - 1);
      const startIndex =
        startsWithQuote && endsWithQuote
          ? lastSpaceIndex + 2
          : lastSpaceIndex + 1;
      const endIndex =
        startsWithQuote && endsWithQuote ? currentIndex - 1 : currentIndex;
      return quickFilter.slice(startIndex, endIndex);
    };
    for (let i = 0; i < quickFilter.length; i++) {
      const char = quickFilter[i];
      if (char === ' ') {
        if (!isQuote(lastSpaceIndex + 1) || isQuote(i - 1)) {
          quickFilterParts.push(getQuickFilterPart(lastSpaceIndex, i));
          lastSpaceIndex = i;
        }
      }
    }
    if (lastSpaceIndex !== quickFilter.length - 1) {
      quickFilterParts.push(
        getQuickFilterPart(lastSpaceIndex, quickFilter.length)
      );
    }
    return quickFilterParts;
  };

  quickFilterMatcher = (
    quickFilterParts: string[],
    rowQuickFilterAggregateText: string
  ) => {
    let result: boolean;
    try {
      result = quickFilterParts.every((part) =>
        rowQuickFilterAggregateText.includes(part)
      );
    } catch {
      result = false;
    }
    return result;
  };

  onSelectionChanged(event: any) {
    this.selectedRows = this.gridApi.getSelectedRows();
  }

  deleteSelectedRows() {
    if (this.selectedRows.length === 0) return;

    const selectedTitles = this.selectedRows.map((row) => row.title);

    this.rowData = this.rowData.filter(
      (row) => !selectedTitles.includes(row.title)
    );

    this.gridApi.applyTransaction({ remove: this.selectedRows });

    this.selectedRows = [];
  }

  formatCategory(category: ICategory): string {
    return category
      .toString()
      .replace(/-/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase());
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
