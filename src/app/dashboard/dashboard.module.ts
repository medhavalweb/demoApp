import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { OrdersComponent } from './orders/orders.component';



@NgModule({
  declarations: [
    DashboardComponent,
    OrdersComponent
  ],
  imports: [
    CommonModule
  ]
})
export class DashboardModule { }
