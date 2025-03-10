import { Component } from '@angular/core';
import * as AgCharts from 'ag-charts-community';
import { getOrders } from '../../dummy-data/orders';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  public options: AgCharts.AgChartOptions = {
    series: [
      {
        data: getOrders(),
        xKey: 'date',
        yKey: 'orders',
        yName: 'Orders',
      },
    ],
    axes: [
      {
        type: 'number',
        position: 'left',
        title: {
          text: 'Orders',
        },
      },
      {
        type: 'time',
        position: 'bottom',
        title: {
          text: 'Date',
        },
        label: {
          format: '%d/%m/%Y',
        },
      },
    ],
  };
}
