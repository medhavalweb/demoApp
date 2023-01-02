import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  submitted: boolean = false;
  apiUrl = 'http://localhost:3000/signupusers';
  loginForm!: FormGroup;

  constructor(private _fb: FormBuilder, private _http:HttpClient, private router:Router, private alert: ToastrService) {}

  ngOnInit(): void {
    this.loginForm = this._fb.group({
      mobile: [
        '',
        [
          Validators.required,
          Validators.pattern('^[0-9]*$'),
          Validators.minLength(10),
          Validators.maxLength(10),
        ],
      ],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }
  // form use in validation purpose
  get f() { return this.loginForm.controls;}

  onLoginUser() {
    this.submitted = true;
    if (this.loginForm.valid) {
      this._http.get<any>(this.apiUrl).subscribe((res)=>{
        const user = res.find((a:any)=>{
          return a.mobile === this.loginForm.value.mobile && a.password === this.loginForm.value.password
        })
        if(user){
          localStorage.setItem("mobile", this.loginForm.value.mobile);
          this.alert.success(`Wellcome to Company Name`, `${user.name}!`)
          this.router.navigate(['dashboard'])
        }else{
          this.alert.error('Incrrect Mobile and Password', 'User not found!')
        }
      })
    }else{
      this.alert.warning('Please Enter Mobile and Password', 'Validation')
    }
  }
}
