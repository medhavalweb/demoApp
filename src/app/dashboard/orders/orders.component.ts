import { Product } from './../_shared/product.interface';
import { OrdersService } from './../_shared/orders.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss'],
})
export class OrdersComponent implements OnInit {
  pageTitle = 'Create Order';
  orderBy = ['SalesMan', 'PartySlef'];
  priorty = ['High', 'Low', 'Medium'];
  deliverymode = ['Delivery to Store', 'Pickup from Store'];
  satus = ['InProcess', 'Inviced', 'Deaft'];
  // forms
  orderForm!: FormGroup;
  orderDetailsdArray!: FormArray;
  orderProduct!: FormGroup;
  // get products varialble
  productsShow!: any;
  masterProducts: Product[] = [];
  constructor(
    private _fb: FormBuilder,
    private router: Router,
    private alert: ToastrService,
    private services: OrdersService
  ) {}

  ngOnInit(): void {
    this.createForm(); // forms grouping function
    this.getProducts(); // get the product dropdown using
  }
  //validation purpose
  get f() {
    return this.orderForm.controls;
  }
  // forms grouping function
  createForm() {
    this.orderForm = this._fb.group({
      orderid: ['', Validators.required],
      date: ['', Validators.required],
      partyname: ['', Validators.required],
      city: ['', Validators.required],
      orderby: ['', Validators.required],
      priorty: ['', Validators.required],
      deliverymode: ['', Validators.required],
      status: ['', Validators.required],
      total: [{ value: 0, disabled: true }],
      tax: [{ value: 0, disabled: true }],
      netTotal: [{ value: 0, disabled: true }],
      orderdetails: this._fb.array([]),
    });
  }
  orderdetailsForm() {
    return this._fb.group({
      pcode: [''],
      productname: [''],
      qty: ['1'],
      price: ['0'],
      totalamount: [{ value: 0, disabled: true }],
    });
  }
  // get the products
  get products() {
    return this.orderForm.get('orderdetails') as FormArray;
  }

  // save function of orders
  saveOrder() {
    console.log(this.orderForm.value);
  }
  // add + button add the Product
  addNewProduct() {
    this.orderDetailsdArray = this.orderForm.get('orderdetails') as FormArray;
    this.orderDetailsdArray.push(this.orderdetailsForm());
  }
  // get the product dropdown using
  getProducts() {
    this.services.getAllProducts().subscribe((res) => {
      this.productsShow = res;
    });
  }
  // select the dropdown and get the values of products
  changeProduct(index: any) {
    this.orderDetailsdArray = this.orderForm.get('orderdetails') as FormArray;
    this.orderProduct = this.orderDetailsdArray.at(index) as FormGroup;
    let productcode = this.orderProduct.get('pcode')?.value;
    let prdData = this.productsShow.find((p: any) => p.id == productcode);
    if (prdData != null) {
      this.orderProduct.get('productname')?.setValue(prdData.productname);
      this.orderProduct.get('price')?.setValue(prdData.price);
      this.orderProduct.get('totalamount')?.setValue(prdData.price);
      this.qtyChange(index);
    }
  }
  //qty and price change calu method
  qtyChange(index: any) {
    this.orderDetailsdArray = this.orderForm.get('orderdetails') as FormArray;
    this.orderProduct = this.orderDetailsdArray.at(index) as FormGroup;
    let qty = this.orderProduct.get('qty')?.value;
    let price = this.orderProduct.get('price')?.value;
    let total = qty * price;
    this.orderProduct.get('totalamount')?.setValue(total);
    this.totalCalculation();
  }
  //total Calculation order calu method
  totalCalculation() {
    let array = this.orderForm.getRawValue().orderdetails;
    let sumtotal = 0;
    array.forEach((x: any) => {
      sumtotal = sumtotal + x.totalamount;
      console.log(sumtotal);
    });
    //tax
    let taxcal = (5 / 100) * sumtotal;
    let nettotalcal = sumtotal + taxcal;

    this.orderForm.get('total')?.setValue(sumtotal);
    this.orderForm.get('tax')?.setValue(taxcal);
    this.orderForm.get('netTotal')?.setValue(nettotalcal);
  }
}
