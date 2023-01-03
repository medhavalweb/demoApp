import { ToastrService } from 'ngx-toastr';
import { OrdersService } from './_shared/orders.service';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  pageTitle = 'Orders Data';
  getOrdersData: any = [];
  searchText!: any;
  //pagination varialble
  page: number = 1;
  count: number = 0;
  tableSize: number = 5;
  tableSizes: any = [5, 10, 15, 20];
  //sorting
  sortFiled: { sortOrder: number; filedName: string } | undefined;
  constructor(private router: Router, private services:OrdersService, private alert:ToastrService) {}

  ngOnInit(): void {
    this.getOrders();
  }
  //get display the all orders
  getOrders() {
    this.services.getAllOrders().subscribe((res)=>{
      this.getOrdersData = res;
    })
  }
  //delete order function
  deleteOrder(id:any){
    if(confirm('Do you want to delete this order?')){
    this.services.deleteOrders(id).subscribe((res)=>{
      console.log(res);
      this.alert.success('Record Delete Successfully!',`Delete!`)
      this.getOrders();
    });
  }
  }
  //edit order
  editOrder(id:any){
    this.router.navigateByUrl('/dashboard/edit/' + id);
  }

  viewOrder(id:any){
    this.router.navigateByUrl('/dashboard/view/' + id);
  }
 //pagination ----
  //pagination custom method
  onTableDataChange(event: any) {
    this.page = event;

  }
  onTableSizeChange(event: any): void {
    this.tableSize = event.target.value;
    this.page = 1;

  }
  //sorting data
    // sorting the datatable method
    sortByFiled(filedName: string): void {
      if (this.sortFiled?.filedName === filedName) {
        this.sortFiled.sortOrder = this.sortFiled.sortOrder == 1 ? -1 : 1;
      } else {
        this.sortFiled = { filedName: filedName, sortOrder: 1 };
      }
      this.getOrdersData = this.getOrdersData.sort((a: any, b: any) => {
        if (this.sortFiled?.sortOrder == -1) {
          if (b[filedName] < a[filedName]) {
            return -1;
          }
          if (b[filedName] > a[filedName]) {
            return 1;
          }
          return 0;
        } else {
          if (a[filedName] < b[filedName]) {
            return -1;
          }
          if (a[filedName] > b[filedName]) {
            return 1;
          }
          return 0;
        }
      });
    }

  // logout user
  logout() {
    localStorage.clear();
    this.router.navigateByUrl('/login');
  }
}
