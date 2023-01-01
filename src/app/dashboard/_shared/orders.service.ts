import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  constructor( private _http:HttpClient) {
  }
// get the dummy products form api
  getAllProducts(){
    return this._http.get('http://localhost:3000/products/')
  }
  getProductbyCode(id:any){
    return this._http.get('http://localhost:3000/products/'+id)
  }
}
