import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

  getAuthicate(){
    return !!localStorage.getItem("mobile");
    }
}
