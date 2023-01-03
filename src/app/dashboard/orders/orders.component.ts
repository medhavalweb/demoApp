import { Product } from './../_shared/product.interface';
import { OrdersService } from './../_shared/orders.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss'],
})
export class OrdersComponent implements OnInit {
  title = 'Create Order';
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
  // edit display info
  editorderno!: any;
  isEdit: boolean = false;
  editData!:any
  editorderData!:any
  btnsubmit: string = 'Save';
  isview!:boolean ;

  constructor(
    private _fb: FormBuilder,
    private router: Router,
    private alert: ToastrService,
    private services: OrdersService,
    private activateroute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.isview = false;
    this.createForm(); // forms grouping function
    this.getProducts(); // get the product dropdown using
    this.editorderno = this.activateroute.snapshot.paramMap.get('id');

    if (this.editorderno != null && this.router.url.includes('edit')) {
      this.title = 'Edit Order';
      this.isEdit = true;
      this.editInfo(this.editorderno);
      this.btnsubmit = 'Update';
    }
    else if (this.router.url.includes('view')){
      this.isview = true;
      this.editInfo(this.editorderno);
    }
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

  orderdetailsForm(data: any) {
    return this._fb.group({
      pcode: [data?.pcode ?? ''],
      productname: [data?.productname ?? ''],
      qty: [data?.qty ?? '1'],
      price: [data?.price ?? '0'],
      totalamount: [{ value:data?.totalamount ?? 0, disabled: true }],
    });
  }
  // get the products
  get products() {
    return this.orderForm.get('orderdetails') as FormArray;
  }
  // save function of orders
  saveOrder() {
    if (this.orderForm.valid) {
      if (this.editorderno != null) {
        this.services
        .updateOrder(this.editorderno,this.orderForm.getRawValue())
        .subscribe((res) => {
          let result: any;
          result = res;
          this.alert.success(
            'Order Updated Sucessfully',
            `Order:${result.orderid}`
          );
          this.router.navigate(['/dashboard']);
        });
      }
      else{
        this.services
        .saveOrders(this.orderForm.getRawValue())
        .subscribe((res) => {
          let result: any;
          result = res;
          this.alert.success(
            'Order Created Sucessfully',
            `Order:${result.orderid}`
          );
          this.router.navigate(['/dashboard']);
        });
      }
    } else {
      this.alert.warning(
        'Please enter values in all mandatory filed',
        `Validation`
      );
    }
  }
   // edit display info
   editInfo(id: any) {
    this.services.getorderbyCode(id).subscribe((res) => {
      this.editData = res;
      console.log(this.editData);
      if (this.editData != null) {
        this.orderForm.setValue({
          orderid: this.editData.orderid,
          date: this.editData.date,
          partyname: this.editData.partyname,
          city: this.editData.city,
          orderby: this.editData.orderby,
          priorty: this.editData.priorty,
          deliverymode: this.editData.deliverymode,
          status: this.editData.status,
          total: this.editData.total,
          tax: this.editData.tax,
          netTotal: this.editData.netTotal,
          orderdetails: []
        });

        for(let i =0; i< this.editData.orderdetails.length; i++){
              this.addNewProduct(this.editData.orderdetails[i])
         }
      }
    });
  }
  // add + button add the Product
  addNewProduct(data?: any) {
    this.orderDetailsdArray = this.orderForm.get('orderdetails') as FormArray;
    this.orderDetailsdArray.push(this.orderdetailsForm(data));
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
  // remove button method
  removeProduct(index: any) {
    if (confirm('Do you want to remove?')) {
      this.orderDetailsdArray.removeAt(index);
      this.totalCalculation();
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
